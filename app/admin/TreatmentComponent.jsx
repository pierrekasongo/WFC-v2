import * as React from 'react';
import Collapsible from 'react-collapsible';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Row, Radio, Checkbox, Table } from 'react-bootstrap';
import * as axios from 'axios';
import { Route, Redirect, Switch, Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import InlineEdit from 'react-edit-inline2';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FaTrash, FaCloudUploadAlt, FaFileExcel, FaPlusSquare } from 'react-icons/fa';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

import * as FileSaver from 'file-saver';

import * as XLSX from 'xlsx';

import NewTreatmentComponent from './NewTreatmentComponent';

export default class TreatmentComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            treatments: [],
            cadres:[],
            facilityTypes:[],
            progress: '',
            treatmentToDelete: '',
            showingNewTreatment: false,
        };
        this.handleUploadTreatment = this.handleUploadTreatment.bind(this);
       
        this.deleteTreatment = this.deleteTreatment.bind(this);

        axios.get('/facility/facilityTypes').then(res => {
            this.setState({ facilityTypes: res.data });
        }).catch(err => console.log(err));
        
        axios.get('/cadre/cadres').then(res => {
            this.setState({ cadres: res.data });
        }).catch(err => {
            console.log(err);
            if (err.response.status === 401) {
                this.props.history.push(`/login`);
            } else {
                console.log(err);
            }
        });

        axios.get('/treatment/treatments').then(res => {
            this.setState({ treatments: res.data });
        }).catch(err => {
            if (err.response.status === 401) {
                this.props.history.push(`/login`);
            } else {
                console.log(err);
            }
        });

        axios.get('/configuration/countries').then(res => {
            this.setState({ countries: res.data });
        }).catch(err => {
            console.log(err);
            if (err.response.status === 401) {
                this.props.history.push(`/login`);
            } else {
                console.log(err);
            }
        });
    }

    createTemplate(treatments){

        const template = [];

        treatments.forEach(tr => {

            template.push({"Activity code":tr.code,"Activity name":tr.name,"Facility type":tr.facility,
            "Cadre":tr.cadre, "Duration":tr.duration});
        });

        return template;
    }
  
    async generateTemplate(treatments){

        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const fileName = 'activities';

        const template = await this.createTemplate(treatments);

        
        const wb = XLSX.utils.book_new();

        const ws_template = XLSX.utils.json_to_sheet(template);
        XLSX.utils.book_append_sheet(wb,ws_template,"ACTIVITIES");
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    deleteTreatment(code) {

        this.setState({
            treatmentToDelete: code
        });
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-ui'>
                        <h3>Confirmation</h3>
                        <p>Are you sure you want to delete this treatment?</p>
                        <button onClick={onClose}>No</button> &nbsp;&nbsp;
                  <button
                            onClick={() => {

                                axios.delete(`/treatment/deleteTreatment/${this.state.treatmentToDelete}`)
                                    .then((res) => {
                                        //Update cadres
                                        axios.get('/treatment/treatments').then(res => {
                                            this.setState({ treatments: res.data });
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

    launchToastr(msg) {
        toastr.options = {
            positionClass: 'toast-top-full-width',
            hideDuration: 15,
            timeOut: 6000
        }
        toastr.clear()
        setTimeout(() => toastr.error(msg), 300)
    }

    handleUploadTreatment(ev) {

        ev.preventDefault();

        const data = new FormData();

        if (this.uploadTreatmentInput.files.length == 0) {
            this.launchToastr("No file selected");
            return;
        }
        data.append('file', this.uploadTreatmentInput.files[0]);

        axios.post('/treatment/uploadTreatments', data,
            {
                onUploadProgress: progressEvent => {
                    var prog = (progressEvent.loaded / progressEvent.total) * 100;
                    var pg = (prog < 100) ? prog.toFixed(2) : prog.toFixed(0);
                    this.setState({ progress: pg });
                    //console.log(pg+"%");
                }
            })
            .then((result) => {
                this.setState({ progress: result.data });
                axios.get('/treatment/treatments').then(res => {
                    this.setState({ treatments: res.data });
                }).catch(err => console.log(err));

            }).catch(err => {
                if (err.response.status === 401) {
                    this.props.history.push(`/login`);
                } else {
                    console.log(err);
                }
            });
    }

    filterTreatement(cadreCode) {

        this.setState({ showingNewTreatment: false });

        axios.get(`/treatment/treatments/${cadreCode}`).then(res => {
            this.setState({ treatments: res.data });
        }).catch(err => {
            console.log(err);
            if (err.response.status === 401) {
                this.props.history.push(`/login`);
            } else {
                console.log(err);
            }
        });
    }
    validateNumericValue(value) {

    }

    handleTreatmentChange(obj) {

        const ident = Object.keys(obj)[0].split("|");

        const code = ident[0];

        const param = ident[1];

        const value = Object.values(obj)[0];

        let data = {
            code: code,
            param: param,
            value: value,
        };
        axios.patch('/treatment/editTreatment', data).then(res => {

            console.log('Value updated successfully');

        }).catch(err => {
            if (err.response.status === 401) {
                this.props.history.push(`/login`);
            } else {
                console.log(err);
            }
        });
    }

    newTreatmentSave(info) {

        let code = info.code;
        let facility_type = info.facility_type;
        let cadre_code = info.cadre_code;
        let name = info.name;
        let duration = info.duration;

        let data = {
            code: code,
            facility_type: facility_type,
            cadre_code: cadre_code,
            name: name,
            duration: duration
        };

        //Insert cadre in the database
        axios.post('/treatment/insertTreatment', data).then(res => {
            //Update the cadres list
            axios.get('/treatment/treatments').then(res => {
                this.setState({
                    treatments: res.data,
                    showingNewTreatment: false
                });
            }).catch(err => console.log(err));

        }).catch(err => {
            if (err.response.status === 401) {
                this.props.history.push(`/login`);
            } else {
                console.log(err);
            }
        });
    }
    
    render() {
        return (
                <div className="tab-main-container">
                            <div className="div-title">
                                Available treatments ({this.state.treatments.length})
                            </div>
                            <FormGroup>
                                <Col sm={10}>
                                    <FormControl
                                        componentClass="select"
                                        onChange={e => this.filterTreatement(e.target.value)}>
                                        <option value="0" key="000">Filter by cadre</option>
                                        {this.state.cadres.map(cadre =>
                                            <option
                                                key={cadre.code}
                                                value={cadre.code}>
                                                {cadre.name}
                                            </option>
                                        )}
                                    </FormControl>
                                </Col>
                            </FormGroup>
                            <hr />
                            <div className="div-table">
                                <table>
                                    <tr>
                                        {/*<td>
                                            <div className="div-add-new-link">
                                                <a href="#" className="add-new-link" onClick={() => this.setState({ showingNewTreatment: true })}>
                                                    <FaPlusSquare /> Add new
                                                </a>
                                            </div>
                                        </td>*/}
                                        <td>
                                            <div>
                                                <button className="button" onClick={() => this.generateTemplate(this.state.treatments)}>
                                                <FaFileExcel /> Download</button>
                                            </div> 
                                        </td>
                                    </tr>
                                </table>
                                <br /><br />
                                <table className="table-list">
                                    <thead>
                                        <tr>
                                            <th>Facility type</th>
                                            <th>Cadre</th>
                                            <th>Name</th>
                                            <th>duration (min)</th>
                                            <th colSpan="2">
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.showingNewTreatment &&
                                            <NewTreatmentComponent
                                                facilityTypes={this.state.facilityTypes}
                                                cadres={this.state.cadres}
                                                save={info => this.newTreatmentSave(info)}
                                                cancel={() => this.setState({ showingNewTreatment: false })} />
                                        }
                                        {this.state.treatments.map(treatment =>

                                            <tr key={treatment.code} >
                                             <td>
                                                    {treatment.facility_type}
                                                </td>
                                                <td>
                                                    {treatment.cadre}
                                                </td>
                                                <td>
                                                    {/*treatment.name_fr*/}
                                                    <div>
                                                        <a href="#">
                                                            <InlineEdit
                                                                validate={this.validateTextValue}
                                                                activeClassName="editing"
                                                                text={treatment.name}
                                                                paramName={treatment.code + '|name'}
                                                                change={this.handleTreatmentChange}
                                                                style={{
                                                                    /*backgroundColor: 'yellow',*/
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
                                                    {/*treatment.duration*/}
                                                    <div>
                                                        <a href="#">
                                                            <InlineEdit
                                                                validate={this.validateTextValue}
                                                                activeClassName="editing"
                                                                text={`` + treatment.duration}
                                                                paramName={treatment.code + '|duration'}
                                                                change={this.handleTreatmentChange}
                                                                style={{
                                                                    /*backgroundColor: 'yellow',*/
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
                                                <td colSpan="2">
                                                    <a href="#" onClick={() => this.deleteTreatment(`${treatment.code}`)}>
                                                        <FaTrash />
                                                    </a>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>  
        )
    }
};