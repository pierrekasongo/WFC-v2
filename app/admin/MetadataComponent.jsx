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
import {FaTrash,FaCloudUploadAlt } from 'react-icons/fa';

export default class MetadataComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            cadres:[],
            treatments:[],
            cadreCode:'',
            progress:'',
            cadreToDelete:'',
            treatmentToDelete:''
        };
        this.handleUploadCadre = this.handleUploadCadre.bind(this);
        this.handleUploadTreatment = this.handleUploadTreatment.bind(this);
        this.handleCadreChange = this.handleCadreChange.bind(this);
        this.deleteCadre = this.deleteCadre.bind(this);
        this.deleteTreatment = this.deleteTreatment.bind(this);

        axios.get('/metadata/cadres') .then(res => {
            this.setState({cadres:res.data });    
        }).catch(err => {
            console.log(err);
            if(err.response.status === 401){
                this.props.history.push(`/login`);
            }else{
                console.log(err);
            }
        });

        axios.get('/metadata/treatments') .then(res => {
            this.setState({treatments:res.data });    
        }).catch(err => {
            if(err.response.status === 401){
                this.props.history.push(`/login`);
            }else{
                console.log(err);
            }
        });
    }
    
    deleteCadre(code){

        this.setState({
            cadreToDelete:code
        });
        confirmAlert({
            customUI: ({ onClose }) => {
              return (
                <div className='custom-ui'>
                  <h3>Confirmation</h3>
                  <p>Are you sure you want to delete this cadre?
                  This will also delete all treatments affected to this cadre.</p>
                  <button  onClick={onClose}>No</button> &nbsp;&nbsp;
                  <button 
                    onClick={() => {
                      //this.handleClickDelete();
                      axios.post(`/metadata/deleteCadre/${this.state.cadreToDelete}`)
                        .then((res) => {
                            axios.get('/metadata/cadres') .then(res => {
                                this.setState({cadres:res.data });    
                            }).catch(err => console.log(err));

                        }).catch(err => {
                            if(err.response.status === 401){
                                this.props.history.push(`/login`);
                            }else{
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

        /*axios.post(`/metadata/deleteCadre/${code}`)
            .then((res) => {
                axios.get('/metadata/cadres') .then(res => {
                    this.setState({cadres:res.data });    
                }).catch(err => console.log(err));

            }).catch(err => {
                if(err.response.status === 401){
                    this.props.history.push(`/login`);
                }else{
                    console.log(err);
                }
            });*/
    }
    deleteTreatment(code){
        axios.post(`/metadata/deleteTreatment/${code}`)
            .then((res) => {
                axios.get('/metadata/treatments') .then(res => {
                    this.setState({treatments:res.data });    
                }).catch(err => console.log(err));

            }).catch(err => {
                if(err.response.status === 401){
                    this.props.history.push(`/login`);
                }else{
                    console.log(err);
                }
            });
    }
    handleUploadTreatment(ev) {

        ev.preventDefault();

        const data = new FormData();
        data.append('file', this.uploadTreatmentInput.files[0]);

        axios.post('/metadata/uploadTreatments', data,
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
                axios.get('/metadata/treatments') .then(res => {
                    this.setState({treatments:res.data });    
                }).catch(err => console.log(err));

            }).catch(err => {
                if(err.response.status === 401){
                    this.props.history.push(`/login`);
                }else{
                    console.log(err);
                }
            });
    }

    handleUploadCadre(ev) {

        ev.preventDefault();

        const data = new FormData();

        data.append('file', this.uploadCadreInput.files[0]);

        axios.post('/metadata/uploadCadres', data,
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
                axios.get('/metadata/cadres') .then(res => {
                    this.setState({cadres:res.data });    
                }).catch(err => console.log(err));

            }).catch(err => {
                if(err.response.status === 401){
                    this.props.history.push(`/login`);
                }else{
                    console.log(err);
                }
            });
    }

    filterTreatement(cadreCode){
        
        axios.get(`/metadata/treatments/${cadreCode}`) .then(res => {
            this.setState({treatments:res.data });    
        }).catch(err => {
            console.log(err);
            if(err.response.status === 401){
                this.props.history.push(`/login`);
            }else{
                console.log(err);
            }
        });
    }
    validateNumericValue(value) {
       
    }
    validateTextValue(text) {
        return (text.length > 0 && text.length < 64);
    }

    handleCadreChange(obj) {

        const ident= Object.keys(obj)[0].split("_");

        const code = ident[0];

        const lang = ident[1];

        const value=Object.values(obj)[0];

        let data = {
            code:code,
            param:'name_'+lang,
            value: value,
        };
        axios.patch('/metadata/editCadre', data).then(res => {

            console.log('Value updated successfully');

        }).catch(err => {
            if(err.response.status === 401){
                this.props.history.push(`/login`);
            }else{
                console.log(err);
            }
        });
    }

    handleTreatmentChange(obj) {

        const ident= Object.keys(obj)[0].split("_");

        const code = ident[0];

        const lang = ident[1];

        const value=Object.values(obj)[0];

        let param='';

        if(lang =='duration'){

            param='duration';
        }else{
           param='name_'+lang;
        }

        let data = {
            code:code,
            param:param,
            value: value,
        };
        axios.patch('/metadata/editTreatment', data).then(res => {

            console.log('Value updated successfully');

        }).catch(err => {
            if(err.response.status === 401){
                this.props.history.push(`/login`);
            }else{
                console.log(err);
            }
        });
    }
    render() {
        return (
            <Panel bsStyle="primary" header="Metadata configuration">
                <Tabs>
                    <TabList>
                        <Tab>Standard cadres</Tab>
                        <Tab>Standard treatments</Tab>
                    </TabList>

                    <TabPanel>
                        <div className="tab-main-container">
                            Available standard cadres ({this.state.cadres.length})
                            <hr/>
                            <div className="div-table">
                                <table className="table-list">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "26%" }}>Code</th>
                                            <th style={{ width: "37%" }}>Name (fr)</th>
                                            <th style={{ width: "37%" }}>Name (en)</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
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
                                                                text={cadre.name_fr}
                                                                paramName={cadre.code+'_fr'}
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
                                                <td>
                                                    {/*cadre.name_en*/}
                                                    <div>
                                                        <a href="#">
                                                            <InlineEdit
                                                                validate={this.validateTextValue}
                                                                activeClassName="editing"
                                                                text={cadre.name_en}
                                                                paramName={cadre.code+'_en'}
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
                                                <td>
                                                    <a href="#" onClick={() => this.deleteCadre(`"${cadre.code}"`)}> 
                                                        <FaTrash />
                                                    </a>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <hr/>
                            <Form horizontal>
                                <div>
                                    <div class="alert alert-warning" role="alert">
                                        Make sure it's a csv file with following headers and order. <br />
                                        Also note that every duplicate code will update the existing value.<br />
                                        ["Code", "Name fr", "Name en"]
                                    </div>
                                    <form onSubmit={this.handleUploadCadre}>
                                        <div>
                                            <input ref={(ref) => { this.uploadCadreInput = ref; }} type="file" />
                                        </div>
                                        <br />
                                        <div>
                                            <span>
                                                <button className="button"><FaCloudUploadAlt /> Upload file</button><span> {this.state.progress}</span>
                                            </span>
                                        </div>
                                    </form>
                                    
                                </div>
                            </Form >
                        </div>
                    </TabPanel>
                    <TabPanel>
                    <div className="tab-main-container">
                            Available standard treatments ({this.state.treatments.length})
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
                                                    {cadre.name_fr}
                                                </option>
                                            )}
                                    </FormControl>
                                </Col>
                            </FormGroup>
                            <hr/>
                            <div className="div-table">
                                <table className="table-list">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "26%" }}>Code</th>
                                            <th style={{ width: "32%" }}>Name (fr)</th>
                                            <th style={{ width: "32%" }}>Name (en)</th>
                                            <th style={{ width: "10%" }}>duration (min)</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.treatments.map(treatment => 

                                            <tr key={treatment.id} >
                                                <td>
                                                    {treatment.code}
                                                </td>
                                                <td>
                                                    {/*treatment.name_fr*/}
                                                    <div>
                                                        <a href="#">
                                                            <InlineEdit
                                                                validate={this.validateTextValue}
                                                                activeClassName="editing"
                                                                text={treatment.name_fr}
                                                                paramName={treatment.code+'_fr'}
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
                                                    {/*treatment.name_en*/}
                                                    <div>
                                                        <a href="#">
                                                            <InlineEdit
                                                                validate={this.validateTextValue}
                                                                activeClassName="editing"
                                                                text={treatment.name_en}
                                                                paramName={treatment.code+'_en'}
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
                                                                validate={this.validateNumericValue}
                                                                activeClassName="editing"
                                                                text={treatment.duration}
                                                                paramName={treatment.code+'_duration'}
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
                                                    <a href="#" onClick={() => this.deleteTreatment(`"${treatment.code}"`)}> 
                                                        <FaTrash />
                                                    </a>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <hr/>
                            <Form horizontal>
                                <div>
                                    <div class="alert alert-warning" role="alert">
                                        Make sure it's a csv file with following headers and order. <br />
                                        Also note that every duplicate code will update the existing value.<br />
                                        ["Code", "Cadre code","Name fr", "Name en","duration(min)"]
                                    </div>
                                    <form onSubmit={this.handleUploadTreatment}>
                                        <div>
                                            <input ref={(ref) => { this.uploadTreatmentInput = ref; }} type="file" />
                                        </div>
                                        <br />
                                        <div>
                                            <span>
                                                <button className="button"><FaCloudUploadAlt /> Upload file</button><span> {this.state.progress}</span>
                                            </span>
                                        </div>
                                    </form>
                                    
                                </div>
                            </Form >
                        </div>
                    </TabPanel>
                </Tabs>
                <br/>
                <br/>
            </Panel>
        )
    }
};