import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Checkbox, Table } from 'react-bootstrap';
import * as axios from 'axios';
import downloadCsv from 'download-csv';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

export default class FromCSVComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            cadreId:0,
            progress: '',
        }
        this.handleUpload = this.handleUpload.bind(this);
    }

    launchToastr(msg){
        toastr.options = {
          positionClass : 'toast-top-full-width',
          hideDuration: 15,
          timeOut: 6000
        }
        toastr.clear()
        setTimeout(() => toastr.error(msg), 300)
    }
    
    generateCSV(){

        let cadreId=this.state.cadreId;

        if(cadreId == 0){
            this.launchToastr("No cadre selected.");
            return;
        }

        const columns = { 
            cadreID: 'cadreID',
            cadre: 'Cadre',
            treatmentId:'TreatmentID',
            treatment:'Treatment',
            duration:'duration',
        };

        axios.get(`/admin/activities_cadres/${cadreId}`).then(res => {

            let data = res.data;

            let csvData=[];

            data.forEach(row => {
                csvData.push({
                    cadreId:row.cadreId,
                    cadre:row.cadreName,
                    treatmentId:row.activityId,
                    treatment:row.activityName,
                    duration:row.duration
                })
            });
            if(csvData.length > 0){
                downloadCsv(csvData, columns);
            }else{
                this.launchToastr("No data found. Please add some treatments to this cadre.");
            }
            

        }).catch(err => console.log(err));
    }

    handleUpload(ev) {

        ev.preventDefault();

        const data = new FormData();

        data.append('file', this.uploadInput.files[0]);

        axios.post('/admin/upload_activity_time', data,
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

    render() {
        return (
            <div className="csv-div">
                <FormGroup>
                    <Col componentClass={ControlLabel} sm={5}>
                        Cadre
                    </Col>
                    <Col sm={10}>
                        <FormControl
                                componentClass="select"
                                onChange={e => this.setState({ cadreId: e.target.value })}
                                value={this.state.cadreId}>
                                <option value="0" key="000">Select value</option>
                                {Object.keys(this.props.cadres).map(cadre =>
                                    <option
                                        key={this.props.cadres[cadre].id}
                                        value={this.props.cadres[cadre].id}>
                                        {this.props.cadres[cadre].name}
                                    </option>
                                )}
                        </FormControl>
                        <br/>
                        <Button bsSize="medium" bsStyle="warning" onClick={() =>this.generateCSV()}>Download csv</Button>
                    </Col>
                </FormGroup>
                
                <hr/>
                <form onSubmit={this.handleUpload}>
                    <div>
                        <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
                    </div>
                    <br />
                    <div>
                        <span>
                            <button >Upload file</button><span> {this.state.progress}</span>
                        </span>
                    </div>
                </form>
                <div className="div-btn-bulk">
                    <Button bsSize="medium" bsStyle="warning" className="btn-bulk" onClick={() => this.props.cancel()}>Cancel</Button>
                    <Button bsSize="medium" bsStyle="warning" className="btn-bulk" onClick={() => this.props.save(this.state)}>Save</Button>
                </div>
                <br /><br/>
            </div >
        );
    }

}