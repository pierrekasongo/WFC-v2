import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button, Table } from 'react-bootstrap';
import axios from 'axios';

export default class CadreImportPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            cadres: [],
            progress: ''
        };

        this.handleUploadCadre = this.handleUploadCadre.bind(this);
        this.uploadCadre = this.uploadCadre.bind(this);

        axios.get('/user/cadres')
            .then(res => { this.setState({ cadres: res.data }); })
            .catch(err => console.log(err));
    }
    handleUploadCadre(ev) {

        ev.preventDefault();

        const data = new FormData();
        data.append('file', this.uploadInputCadre.files[0]);
        data.append('type', 'CADRE');

        axios.post('/ihris/upload', data,
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

    uploadCadre(ev) {
        this.setState({ progress: 'Downloading...' });
        axios.get(`/ihris/download_cadres`).then(res => {
            this.setState({ progress: "Done" });
        }).catch(err => console.log(err));
    }

    render() {
        return (
            <Form horizontal>
                <div>
                    <div class="alert alert-warning" role="alert">
                        Make sure it's a csv file with following headers and order. <br />
                        ["Cadre code", "Cadre name"]
                    </div>
                    <form onSubmit={this.handleUploadCadre}>
                        <div>
                            <input ref={(ref) => { this.uploadInputCadre = ref; }} type="file" />
                        </div>
                        <br />
                        <div>
                            <span>
                                <button>Upload file</button><span> {this.state.progress}</span>
                            </span>
                        </div>
                    </form>
                    <hr />
                    <span><h4 >Load cadres from iHRIS</h4></span>
                    <Button onClick={this.uploadCadre} bsStyle="warning" bsSize="small">
                        Load cadres  from iHRIS
                    </Button>
                    <span> 
                        {this.state.progress}
                    </span>
                </div>
                <hr key="1" />
                <div class="alert alert-warning" role="alert">
                    {this.state.cadres.length} cadres imported.
                </div>
            </Form >
        )
    }

};