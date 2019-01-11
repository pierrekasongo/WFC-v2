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

    renderForm() {
        return (
            <Form horizontal>
                <div class="alert alert-warning" role="alert">
                    Make sure it's a csv file with following headers and order. <br />
                    [Facility ID,Region, District, Facility code, Facility name]
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
                <div class="alert alert-warning" role="alert">
                    {this.state.facilities.length} facilities imported.
                </div>
                <hr />
                
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
            <div style={{ width: "85%", margin: "0 auto 0" }}>
                {this.state.state == 'form' && this.renderForm()}
                {this.state.state == 'loading' && this.renderLoading()}
            </div>
        );
    }

};