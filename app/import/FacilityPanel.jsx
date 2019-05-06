import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button, Table } from 'react-bootstrap';
import axios from 'axios';

export default class FacilityPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            facilities: [],
            state: 'form',
            results: null,
            progress: ''
        };

        this.handleUpload = this.handleUpload.bind(this);
        this.getFromAPI=this.getFromAPI.bind(this);

        axios.get('/user/facilities')
            .then(res => this.setState({ facilities: res.data }))
            .catch(err => console.log(err));
    }

    handleUpload(ev) {

        ev.preventDefault();

        const data = new FormData();
        data.append('file', this.uploadInput.files[0]);
        data.append('type', 'FAC');

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

    getFromAPI(){

        this.setState({state:'loading'});

        setTimeout(()=>{

            axios.get('/dhis2/import_facilities_from_dhis2').then(res => {
            this.setState({state:'form'});
                                            
            }).catch(err => console.log(err));

        },400); 
    }

    renderForm() {
        return (
            <Form horizontal>
                <div>
                    <div class="alert alert-warning" role="alert">
                        Make sure it's a csv file with following headers and order. <br />
                        ["Region code", "Region name", "District code", "District name", "Facility code", "Facility name"]
                    </div>
                    <form onSubmit={this.handleUpload}>
                        <div>
                            <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
                        </div>
                        <br />
                        <div>
                            <span>
                                <button>Upload file</button><span> {this.state.progress}</span>
                            </span>
                        </div>
                    </form>
                    <hr />
                    <div style={{ textAlign: "left", paddingTop: 10 }}>
                        <span><h4 >Load facilities from DHIS2</h4></span>
                        <Button bsStyle="warning" bsSize="small" onClick={() => this.getFromAPI()}>Upload from DHIS2</Button>
                    </div>
                    <hr />
                    <div class="alert alert-warning" role="alert">
                        {this.state.facilities.length} facilities imported.
                    </div>
                </div>
            </Form >
        );
    }

    renderLoading() {
        return (
            <div style={{ marginTop: 120, marginBottom: 65 }}>
                <div className="loader"></div>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.state.state == 'form' && this.renderForm()}
                {this.state.state == 'loading' && this.renderLoading()}
            </div>
        );
    }

};