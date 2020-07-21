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
import { FaTrash, FaCloudUploadAlt, FaCheck, FaPlusSquare,FaFileExcel} from 'react-icons/fa';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

import * as FileSaver from 'file-saver';

import * as XLSX from 'xlsx';

import NewCadreComponent from './NewCadreComponent';

export default class CadreComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showingNewCadre: false,
            selectedCadre: {},
            isEditCadre: false,
            cadres: [],
            cadreCode: '',
            progress: '',
            cadreToDelete: '',
        };
        this.handleUploadCadre = this.handleUploadCadre.bind(this);
        this.deleteCadre = this.deleteCadre.bind(this);
        
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
    }

    createTemplate(cadres){

        const template = [];

        cadres.forEach(cd => {

            template.push({"Cadre code":cd.code,"Care name":cd.name,"Work days":cd.work_days,
            "Work hours":cd.work_hours, "Annual leave":cd.annual_leave,"Sick leave":cd.sick_leave,
            "Other leave":cd.other_leave,"Admin task(%)":cd.admin_task});
        });

        return template;
    }
  
    async generateTemplate(cadres){

        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const fileName = 'cadreWorktime';

        const template = await this.createTemplate(cadres);

        
        const wb = XLSX.utils.book_new();

        const ws_template = XLSX.utils.json_to_sheet(template);
        XLSX.utils.book_append_sheet(wb,ws_template,"CADRE WORKTIME");
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    deleteCadre(code) {

        this.setState({
            cadreToDelete: code
        });
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-ui'>
                        <h3>Confirmation</h3>
                        <p>Are you sure you want to delete this cadre?
                  This will also delete all treatments affected to this cadre.</p>
                        <button onClick={onClose}>No</button> &nbsp;&nbsp;
                        <button
                            onClick={() => {

                                axios.delete(`/cadre/deleteCadre/${this.state.cadreToDelete}`)
                                    .then((res) => {
                                        //Update cadres
                                        axios.get('/cadre/cadres').then(res => {
                                            this.setState({ cadres: res.data });
                                        }).catch(err => console.log(err));
                                        //Update treatments 
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

    handleUploadCadre(ev) {

        ev.preventDefault();

        const data = new FormData();

        if (this.uploadCadreInput.files.length == 0) {
            this.launchToastr("No file selected");
            return;
        }

        data.append('file', this.uploadCadreInput.files[0]);

        axios.post('/cadre/uploadCadres', data,
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
                axios.get('/cadre/cadres').then(res => {
                    this.setState({ cadres: res.data });
                }).catch(err => console.log(err));

            }).catch(err => {
                if (err.response.status === 401) {
                    this.props.history.push(`/login`);
                } else {
                    console.log(err);
                }
            });
    }

    validateTextValue(text) {
        return (text.length > 0 && text.length < 64);
    }

    handleCadreChange(obj) {

        const ident = Object.keys(obj)[0].split("|");

        const code = ident[0];

        const param = ident[1];

        const value = Object.values(obj)[0];

        console.log(code, param, value);

        let data = {
            code: code,
            param: param,
            value: value,
        };
        axios.patch('/cadre/editCadre', data).then(res => {

            console.log('Value updated successfully');

        }).catch(err => {
            if (err.response.status === 401) {
                this.props.history.push(`/login`);
            } else {
                console.log(err);
            }
        });
    }

    newCadreSave(info) {

        let code = info.code;
        let name = info.name;
        let worktime = info.worktime;
        let admin_task = info.admin_task;

        let data = {
            code: code,
            name: name,
            worktime: worktime,
            admin_task: admin_task
        };
        //Insert cadre in the database
        axios.post('/cadre/insertCadre', data).then(res => {
            //Update the cadres list
            axios.get('/cadre/cadres').then(res => {
                this.setState({
                    cadres: res.data,
                    showingNewCadre: false
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

    clickCadreEdit(cadreCode) {

        axios.get(`/cadre/getCadre/${cadreCode}`).then(res => {

            let cadre = res.data[0];

            let selectedCadre = {};

            selectedCadre = {
                code: cadre.code,
                name: cadre.name,
                worktime: cadre.worktime,
                admin_task: cadre.admin_task
            }
            this.setState({
                isEditCadre: true,
                selectedCadre: selectedCadre,
                showingNewCadre: true,

            });
            console.log(this.selectedCadre);
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
                                Available standard cadres ({this.state.cadres.length})
                            </div>
                            <hr />
                            <div className="div-table">
                                <table>
                                    <tr>
                                        {/*<td>
                                            <div className="div-add-new-link">
                                                <a href="#" className="add-new-link" onClick={() => this.setState({ showingNewCadre: true, isEditCadre: false, selectedCadre: '' })}>
                                                    <FaPlusSquare /> Add new
                                                </a>
                                            </div>
                                        </td>*/}
                                        <td>
                                            <div>
                                                <button className="button" onClick={() => this.generateTemplate(this.state.cadres)}>
                                                <FaFileExcel /> Download</button>
                                            </div>  
                                        </td>
                                    </tr>
                                </table>
                                
                                <br /> 
                                <br />
                                <table className="table-list">
                                    <thead>
                                        <tr>
                                            <th>Code  </th>
                                            <th>Name  </th>
                                            <th>Days per week  </th>
                                            <th>Hours per day  </th>
                                            <th>Annual leave  </th>
                                            <th>Sick leave  </th>
                                            <th>Other leave  </th>
                                            <th>Admin task (%)</th>
                                            <th colSpan="2"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.state.showingNewCadre &&
                                            <NewCadreComponent
                                                cadre={this.state.selectedCadre}
                                                isEditCadre={this.state.isEditCadre}
                                                save={info => this.newCadreSave(info)}
                                                cancel={() => this.setState({ showingNewCadre: false })} />
                                        }
                                        {this.state.cadres.map(cadre =>
                                            <tr key={cadre.id} >
                                                <td>
                                                    {cadre.code}
                                                </td>
                                                <td>
                                                    {/*cadre.name_fr*/}
                                                    <div>
                                                        <a href="#">
                                                            <InlineEdit
                                                                validate={this.validateTextValue}
                                                                activeClassName="editing"
                                                                text={cadre.name}
                                                                paramName={cadre.code + '|name'}
                                                                change={this.handleCadreChange}
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
                                                
                                                <td align="center">
                                                    <div>
                                                        <a href="#">
                                                            <InlineEdit
                                                                validate={this.validateTextValue}
                                                                activeClassName="editing"
                                                                text={"" + cadre.work_days}
                                                                paramName={cadre.code + '|work_days'}
                                                                change={this.handleCadreChange}
                                                                style={{
                                                                    minWidth: 50,
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
                                                <td align="center">
                                                    <div>
                                                        <a href="#">
                                                            <InlineEdit
                                                                validate={this.validateTextValue}
                                                                activeClassName="editing"
                                                                text={"" + cadre.work_hours}
                                                                paramName={cadre.code + '|work_hours'}
                                                                change={this.handleCadreChange}
                                                                style={{
                                                                    minWidth: 50,
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
                                                <td align="center">
                                                    <div>
                                                        <a href="#">
                                                            <InlineEdit
                                                                validate={this.validateTextValue}
                                                                activeClassName="editing"
                                                                text={"" + cadre.annual_leave}
                                                                paramName={cadre.code + '|annual_leave'}
                                                                change={this.handleCadreChange}
                                                                style={{
                                                                    minWidth: 50,
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
                                                <td align="center">
                                                    <div>
                                                        <a href="#">
                                                            <InlineEdit
                                                                validate={this.validateTextValue}
                                                                activeClassName="editing"
                                                                text={"" + cadre.sick_leave}
                                                                paramName={cadre.code + '|sick_leave'}
                                                                change={this.handleCadreChange}
                                                                style={{
                                                                    minWidth: 50,
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
                                                <td align="center">
                                                    <div>
                                                        <a href="#">
                                                            <InlineEdit
                                                                validate={this.validateTextValue}
                                                                activeClassName="editing"
                                                                text={"" + cadre.other_leave}
                                                                paramName={cadre.code + '|other_leave'}
                                                                change={this.handleCadreChange}
                                                                style={{
                                                                    minWidth: 50,
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
                                                <td align="center">
                                                    <div>
                                                        <a href="#">
                                                            <InlineEdit
                                                                validate={this.validateTextValue}
                                                                activeClassName="editing"
                                                                text={"" + cadre.admin_task}
                                                                paramName={cadre.code + '|admin_task'}
                                                                change={this.handleCadreChange}
                                                                style={{
                                                                    minWidth: 50,
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
                                                <td colSpan="3">
                                                    <a href="#" onClick={() => this.deleteCadre(`"${cadre.code}"`)}>
                                                        <FaTrash />
                                                    </a>
                                                    {/*<a href="#" onClick={() => this.clickCadreEdit(`"${cadre.code}"`)}>
                                                        <FaEdit />
                                                    </a>*/}
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