import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import InlineEdit from 'react-edit-inline2';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import { FaTrash, FaCloudUploadAlt, FaCheck, FaFileCsv, FaFolderOpen } from 'react-icons/fa';
//import TreeView from 'react-pretty-treeview';

export default class ServiceUploadPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            results: [],
            cadres: [],
            facilities: [],
            years: [],//Save years to db
            regions: [],
            districts: [],
            selectedPeriod: "",
            selectedFacility: "",
            selectedCadre: "",
            filteredFacility: "",
            filteredCadre: "",
            statistics: [],
            filteredStats: [],
            state: 'done',
            serviceToDelete:"",
            progress: '',
        };

        this.handleUploadService = this.handleUploadService.bind(this);

        axios.get('/countrystatistics/statistics').then(res => {
            this.setState({
                statistics: res.data,
                filteredStats: res.data
            })
        }).catch(err => console.log(err));
    }

    handleUploadService(ev) {

        ev.preventDefault();

        const data = new FormData();

        data.append('file', this.uploadServiceInput.files[0]);

        if (this.uploadServiceInput.files.length == 0) {
            this.launchToastr("No file selected. Please select a valid file before validating.");
            return;
        }

        axios.post('/countrystatistics/uploadService', data,
            {
                onUploadProgress: progressEvent => {
                    var prog = (progressEvent.loaded / progressEvent.total) * 100;
                    var pg = (prog < 100) ? prog.toFixed(2) : prog.toFixed(0);
                    this.setState({ progress: pg });
                }
            })
            .then((result) => {
                this.setState({ progress: result.data });
                axios.get('/countrystatistics/statistics').then(res => {
                    this.setState({
                        statistics: res.data,
                        filteredStats: res.data
                    })
                }).catch(err => console.log(err));

            }).catch(err => {
                if (err.response.status === 401) {
                    this.props.history.push(`/login`);
                } else {
                    console.log(err);
                }
            });
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

    handleServiceChange(obj) {

        const ident = Object.keys(obj)[0].split("-");

        const id = ident[0];

        const param = ident[1];

        const value = Object.values(obj)[0];

        let data = {
            id: id,
            param: param,
            value: value,
        };
        axios.patch('/countrystatistics/editPatientsCount', data).then(res => {

            axios.get('/countrystatistics/statistics').then(res => {

                this.setState({
                    statistics: res.data,
                    filteredStats: res.data
                })
            }).catch(err => console.log(err));
        }).catch(err => {
            if (err.response.status === 401) {
                this.props.history.push(`/login`);
            } else {
                console.log(err);
            }
        });
    }

    deleteService(id) {

        this.setState({
            serviceToDelete: id
        });
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-ui'>
                        <h3>Confirmation</h3>
                        <p>Are you sure you want to delete this record?</p>
                        <button onClick={onClose}>No</button> &nbsp;&nbsp;
                        <button
                            onClick={() => {
                                axios.delete(`/countrystatistics/delete/${this.state.serviceToDelete}`)
                                    .then((res) => {
                                        axios.get('/countrystatistics/statistics').then(res => {

                                            this.setState({
                                                statistics: res.data,
                                                filteredStats: res.data
                                            })
                                        }).catch(err => console.log(err));

                                    }).catch(err => {
                                        if (err.response.status === 401) {
                                            this.props.history.push(`/login`);
                                        } else {
                                            console.log(err);
                                        }
                                    });
                                onClose();
                            }}>
                            Yes, Delete it!
                        </button>
                    </div>
                );
            }
        });
    }

    render() {
        return (
            <div className="calc-container">
                            <div className="calc-container-left">
                                <Form horizontal>
                                    <div className="div-title">
                                        <b>Set import values</b>
                                    </div>
                                    <hr />
                                    <FormGroup>
                                            <Col componentClass={ControlLabel} sm={20}>

                                                <div class="alert alert-warning" role="alert">
                                                    <p>Make sure it's a csv file with following headers and order.</p>
                                                    <p><b>"Region","District","Facility code", "Facility name", "Cadre code", "Cadre name", "Activity code", "Activity name", "Year","Patient count"</b></p>
                                                </div>

                                                <form onSubmit={this.handleUploadService}>
                                                    <div class="upload-btn-wrapper">
                                                        <button class="btn"><FaFolderOpen /> Choose file...</button>
                                                        <input ref={(ref) => { this.uploadServiceInput = ref; }} type="file" />
                                                    </div>
                                                    <br />
                                                    <br />
                                                    <div>
                                                        <span>
                                                            <button className="button"><FaCloudUploadAlt /> Upload file</button><span> {this.state.progress}</span>
                                                        </span>
                                                    </div>
                                                </form>
                                            </Col>
                                        </FormGroup>
                                </Form>
                            </div>
                            <div className="calc-container-right">
                                <FormGroup>
                                    <Col componentClass={ControlLabel} sm={20}>
                                        <div className="div-title">
                                            <b>Annual treatment statistics</b>({this.state.filteredStats.length})
                                        </div>
                                    </Col>
                                    <div className="filter-container">
                                        <div>
                                            <FormGroup>
                                                <Col sm={15}>
                                                    <FormControl componentClass="select"
                                                        onChange={e => this.filterStatByCadre(e.target.value)}>
                                                        <option key="000" value="000">Filter by cadre</option>
                                                        {(this.state.cadres.map(cd =>
                                                            <option key={cd.code} value={cd.code}>{cd.name}</option>
                                                        ))}
                                                    </FormControl>
                                                </Col>
                                            </FormGroup>
                                        </div>

                                        <div>
                                            <FormGroup>
                                                <Col sm={15}>
                                                    <input typye="text" className="form-control"
                                                        placeholder="Filter by facility" onChange={e => this.filterStatByFacility(e.target.value)} />
                                                </Col>
                                            </FormGroup>
                                        </div>
                                    </div>
                                </FormGroup>
                                <hr />
                                {this.state.state == 'loading' &&
                                    <div style={{ marginTop: 120, marginBottom: 65 }}>
                                        <div className="loader"></div>
                                    </div>
                                }
                                <table className="table-list">
                                    <thead>
                                        <tr>
                                            <th>Facility</th>
                                            <th>Cadre</th>
                                            <th>Treatment</th>
                                            <th># patients</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.filteredStats.map(st =>
                                            <tr key={st.id}>
                                                <td>{st.facility}</td>
                                                <td>{st.cadre}</td>
                                                <td>{st.treatment}</td>
                                                {/*<td>{tr.patients}</td>*/}
                                                <td>
                                                    <div>
                                                        <a href="#">
                                                            <InlineEdit
                                                                validate={this.validateTextValue}
                                                                activeClassName="editing"
                                                                text={`` + st.patients}
                                                                paramName={st.id + '-caseCount'}
                                                                change={this.handleServiceChange}
                                                                style={{
                                                                    minWidth: 150,
                                                                    display: 'inline-block',
                                                                    margin: 0,
                                                                    padding: 0,
                                                                    fontSize: 11,
                                                                    outline: 0,
                                                                    border: 0
                                                                }}
                                                            />
                                                        </a>
                                                    </div>
                                                </td>
                                                <td>
                                                    <a href="#" onClick={() => this.deleteService(`${st.id}`)}>
                                                        <FaTrash />
                                                    </a>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <br />
                        </div>
                        
        )
    }
};