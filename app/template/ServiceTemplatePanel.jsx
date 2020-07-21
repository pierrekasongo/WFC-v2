import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import InlineEdit from 'react-edit-inline2';
import downloadCsv from 'download-csv';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import { FaTrash, FaCloudUploadAlt, FaQuestion, FaFileCsv, FaFolderOpen, FaCheckSquare } from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';
import Multiselect from 'react-multiselect-checkboxes';

import ExcelServiceComponent from './ExcelServiceComponent';

export default class ServiceTemplatePanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            cadres:[],
            treatments:[],
            facilities:[],
            selectedPeriod:"",
            years:[]
        };
        axios.get('/cadre/cadres').then(res => {

            this.setState({ cadres: res.data });

        }).catch(err => console.log(err));

        axios.get('/facility/facilities').then(res => {

            this.setState({ facilities: res.data });

        }).catch(err => console.log(err));

        axios.get('/treatment/treatments').then(res => {

            this.setState({ treatments: res.data });

        }).catch(err => console.log(err));

        axios.get('/configuration/getYears').then(res => {
            let years = res.data;
            this.setState({
                years: years
            })
        }).catch(err => console.log(err));
    }

    
    render() {
        return (
            <div className="calc-container">
            
                <div className="calc-container-left">
                    <Form horizontal>
                                    <div className="div-title">
                                        <b>Set parameters</b>
                                    </div>
                                    <FormGroup>
                                        <Col componentClass={ControlLabel} sm={10}>
                                            Year
                                        </Col>

                                        <Col sm={15}>
                                            <FormControl componentClass="select"
                                                onChange={e => this.setState({ selectedPeriod: e.target.value })}>
                                                <option key="000" value="000">Select year </option>
                                                {(this.state.years.map(yr =>
                                                    <option key={yr.id} value={yr.year}>{yr.year}</option>
                                                ))}
                                            </FormControl>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup>
                                        <Col sm={15}>
                                            <FormGroup>
                                                <Col componentClass={ControlLabel} sm={10}>
                                                    Facilities ({(this.state.facilities.length)})
                                                </Col>
                                                <Col sm={15}>
                                                    <FormControl componentClass="select"
                                                        onChange={e => this.setState({ selectedFacility: e.target.value })}>
                                                        <option key="000" value="000">Select value</option>
                                                        {(this.state.facilities.map(fa =>
                                                            <option key={fa.code} value={fa.code}>{fa.name}</option>
                                                        ))}
                                                    </FormControl>
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                    </FormGroup>

                                    <FormGroup>
                                        <Col sm={15}>
                                            <FormGroup>
                                                <Col componentClass={ControlLabel} sm={10}>
                                                    Cadres ({(this.state.cadres.length)})
                                        </Col>
                                                <Col sm={15}>
                                                    <FormControl componentClass="select"
                                                        onChange={e => this.setState({ selectedCadre: e.target.value })}>
                                                        <option key="000" value="000">Select value</option>
                                                        {(this.state.cadres.map(cd =>
                                                            <option key={cd.code} value={cd.code}>{cd.name}</option>
                                                        ))}
                                                    </FormControl>
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                    </FormGroup>
                                    <hr />
                                    
                                </Form>
                </div>

                <div className="calc-container-right">
                    <Form horizontal>
                        <div>
                            <div class="alert alert-warning" role="alert">
                                <p>You can generate an Excel template for activity data by clicking below button.</p>
                                <p>You can select the year, cadres and facilities in the right panel.</p>
                            </div>

                            <ExcelServiceComponent 
                                facilities={this.state.facilities}
                                cadres={this.state.cadres}
                                treatments={this.state.treatments}
                                year={this.state.selectedPeriod}
                            />
                        </div>
                    </Form>
                </div>
                
            </div>
        )
    }

};