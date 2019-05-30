import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import { FaCloudUploadAlt, FaFolderOpen } from 'react-icons/fa';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

export default class FacilityPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            facilities: [],
            state: 'result',
            results: null,
            progress: ''
        };

        this.handleUpload = this.handleUpload.bind(this);

        this.getFromAPI = this.getFromAPI.bind(this);

        axios.get('/hris/facilities')
            .then(res => this.setState({ facilities: res.data }))
            .catch(err => console.log(err));
    }

    launchToastr(msg) {
        toastr.options = {
            positionClass: 'toast-top-full-width',
            hideDuration: 15,
            timeOut: 6000
        }
        toastr.clear()
        setTimeout(() => toastr.error(msg), 300)
    }

    handleUpload(ev) {

        ev.preventDefault();

        const data = new FormData();
        data.append('file', this.uploadInput.files[0]);
        data.append('type', 'FAC');

        if (this.uploadInput.files.length == 0) {
            this.launchToastr("No file selected");
            return;
        }

        axios.post('/dhis2/upload', data,
            {
                onUploadProgress: progressEvent => {
                    var prog = (progressEvent.loaded / progressEvent.total) * 100;
                    var pg = (prog < 100) ? prog.toFixed(2) : prog.toFixed(0);
                    this.setState({ progress: pg });
                    //console.log(pg+"%");
                }
            })
            .then((result) => {
                //console.log(result.data);
                this.setState({ progress: result.data });
            }).catch(err => console.log(err));
    }

    getFromAPI() {

        this.setState({ state: 'loading' });

        setTimeout(() => {

            axios.get('/dhis2/import_facilities_from_dhis2').then(res => {
                this.setState({ state: 'form' });

            }).catch(err => console.log(err));

        }, 400);
    }

    render() {
        return (
            <div className="tab-main-container">
                <Form horizontal>
                    <div className="cadres-container">
                        <div className="div-flex-table-left">
                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={20}>
                                    <div className="div-title">
                                        <b>Import from csv file</b>
                                    </div>
                                    <hr />
                                </Col>
                            </FormGroup>
                            <div class="alert alert-warning" role="alert">
                                <p>Make sure it's a csv file with following headers and order. </p>
                                <p><b>"Region code", "Region name", "District code", "District name", "Facility code", "Facility name"</b></p>
                            </div>

                            <form onSubmit={this.handleUpload}>
                                <div class="upload-btn-wrapper">
                                    <button class="btn"><FaFolderOpen /> Choose file...</button>
                                    <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
                                </div>
                                <br />
                                <br />
                                <div>
                                    <span>
                                        <button className="button"><FaCloudUploadAlt /> Upload file</button><span> {this.state.progress}</span>
                                    </span>
                                </div>
                            </form>
                            <hr />
                            <div style={{ textAlign: "left", paddingTop: 10 }}>
                                <FormGroup>
                                    <Col componentClass={ControlLabel} sm={20}>
                                        <div className="div-title">
                                            <b>Load facilities from DHIS2</b>
                                        </div>
                                        <hr />
                                    </Col>
                                </FormGroup>
                                <Button bsStyle="warning" bsSize="small" onClick={() => this.getFromAPI()}>Upload from DHIS2</Button>
                            </div>

                        </div>

                        <div className="div-flex-table-right">
                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={20}>
                                    <div className="div-title">
                                        <b>Facilities</b>
                                    </div>
                                    <hr />
                                </Col>
                            </FormGroup>
                            <div class="alert alert-warning" role="alert">
                                {this.state.facilities.length} facilities imported.
                            </div>
                            {this.state.state == 'loading' &&
                                <div style={{ marginTop: 120, marginBottom: 65 }}>
                                    <div className="loader"></div>
                                </div>
                            }
                            {this.state.state == 'result' &&
                                <table className="table-list" cellSpacing="10">
                                    <thead>
                                        <th>Region</th>
                                        <th>District</th>
                                        <th>Facility</th>
                                    </thead>
                                    <tbody>
                                        {this.state.facilities.map(fac =>
                                            <tr key={fac.id}>
                                                <td>{fac.region}</td>
                                                <td>{fac.district}</td>
                                                <td>{fac.name}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            }
                        </div>
                    </div>
                </Form>
            </div>
        );
    }
};