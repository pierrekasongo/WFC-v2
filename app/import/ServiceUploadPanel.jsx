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

export default class ServiceUploadPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            stdCadres: [],
            countryCadres: [],
            stdTreatements: [],
            filteredTreatments: [],
            countryTreatments: [],
            dhis2Treatments: [],
            selectedStdCadre: '',
            selectedCountryCadre: '',
            progress: '',
            treatmentToDelete: 0,
            treatmentToMatch: "",
            treatmentMap: new Map(),
        };
        axios.get('/metadata/cadres').then(res => {

            this.setState({ stdCadres: res.data });

        }).catch(err => console.log(err));

        axios.get('/metadata/treatments').then(res => {

            this.setState({ stdTreatements: res.data });

        }).catch(err => console.log(err));

        axios.get('/countrytreatment/treatments').then(res => {

            let treatmentMap = new Map();

            res.data.forEach(tr => {
                treatmentMap.set(tr.code, "");
            })
            this.setState({

                countryTreatments: res.data,
                filteredTreatments: res.data,
                treatmentMap: treatmentMap
            });

        }).catch(err => console.log(err));

        axios.get('/countrycadre/cadres').then(res => {

            this.setState({ countryCadres: res.data });

        }).catch(err => console.log(err));
    }

    filterStdTreatement(cadreCode) {

        this.setState({ selectedStdCadre: cadreCode })
        axios.get(`/metadata/treatments/${cadreCode}`).then(res => {
            this.setState({ stdTreatements: res.data });
        }).catch(err => {
            console.log(err);
            if (err.response.status === 401) {
                this.props.history.push(`/login`);
            } else {
                console.log(err);
            }
        });
    }

    filterCountryTreatement(cadreCode) {

        this.setState({ selectedCountryCadre: cadreCode })
        axios.get(`/countrytreatment/treatments/${cadreCode}`).then(res => {
            this.setState({
                countryTreatments: res.data,
                filteredTreatments: res.data,
            });
        }).catch(err => {
            console.log(err);
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

    handleTreatmentChange(obj) {

        const ident = Object.keys(obj)[0].split("|");

        const code = ident[0];

        const param = ident[1];

        const value = Object.values(obj)[0];

        let data = {
            std_code: code,
            param: param,
            value: value,
        };
        axios.patch('/countrytreatment/editTreatment', data).then(res => {

            axios.get('/countrytreatment/treatments').then(res => {
                this.setState({
                    countryTreatments: res.data,
                    filteredTreatments: res.data,
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
                                axios.delete(`/countrytreatment/deleteTreatment/${this.state.treatmentToDelete}`)
                                    .then((res) => {
                                        //Update cadres
                                        axios.get('/countrytreatment/treatments').then(res => {
                                            let treatmentMap = new Map();

                                            res.data.forEach(tr => {
                                                treatmentMap.set(tr.code, "");
                                            })
                                            this.setState({

                                                countryTreatments: res.data,
                                                filteredTreatments: res.data,
                                                treatmentMap: treatmentMap
                                            });
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

    useStdTreatment(code) {

        axios.get(`/metadata/getTreatment/${code}`).then(res => {

            let stdTreatment = res.data[0];

            let code = stdTreatment.code;

            let cadre_code = stdTreatment.cadre_code;

            let cadre = stdTreatment.cadre;

            let name = stdTreatment.name_fr + "/" + stdTreatment.name_en;

            let facility_type = stdTreatment.facility_type;

            let duration = stdTreatment.duration;

            let data = {
                code: code,
                cadre_code: cadre_code,
                name: name,
                duration: duration,
                facility_type:facility_type
            }
            //Check if cadre exist in country db
            axios.get(`/countrycadre/getCadre/${cadre_code}`).then(res => {

                let stdCadre = res.data[0];

                if (res.data.length > 0) {

                    axios.post(`/countrytreatment/insertTreatment`, data).then(res => {

                        axios.get('/countrytreatment/treatments').then(res => {

                            let treatmentMap = new Map();

                            res.data.forEach(tr => {
                                treatmentMap.set(tr.code, "");
                            })
                            this.setState({

                                countryTreatments: res.data,
                                filteredTreatments: res.data,
                                treatmentMap: treatmentMap
                            });

                        }).catch(err => console.log(err));

                    }).catch(err => console.log(err));
                } else {
                    this.launchToastr(`Cadre ${cadre} with code ${cadre_code} not 
                                        part of the country cadres.<br> You should first use the cadre for your country.`);
                }
            }).catch(err => console.log(err));

        }).catch(err => console.log(err));
    }

    filterCountryTreatment(name) {
        let treats = this.state.countryTreatments;
        this.setState({ filteredTreatments: treats.filter(tr => tr.name_std.toLowerCase().includes(name.toLowerCase())) })
    }
    
    render() {
        return (
            <div className="tab-main-container">
                <Form horizontal>
                    <div>
                        <div className="cadres-container">
                            <div className="div-flex-table-left">
                                <FormGroup>
                                    <Col componentClass={ControlLabel} sm={20}>
                                        <div className="div-title">
                                            <b>Standard treatments</b> ({this.state.stdTreatements.length})
                                        </div>
                                        <hr />
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col sm={10}>
                                        <FormControl
                                            componentClass="select"
                                            onChange={e => this.filterStdTreatement(e.target.value)}>
                                            <option value="0" key="000">Filter by cadre</option>
                                            {this.state.stdCadres.map(cadre =>
                                                <option
                                                    key={cadre.code}
                                                    value={cadre.code}>
                                                    {cadre.name_fr + '/' + cadre.name_en}
                                                </option>
                                            )}
                                        </FormControl>
                                    </Col>
                                </FormGroup>
                                <hr />
                                <table className="table-list">
                                    <thead>
                                        <tr>
                                            <th>Name (fr)</th>
                                            <th>Name (en)</th>
                                            <th>Duration (min)</th>
                                            <th colSpan="2"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.stdTreatements.map(treatment =>

                                            <tr key={treatment.code} >
                                                <td>
                                                    {treatment.name_fr}
                                                </td>
                                                <td>
                                                    {treatment.name_en}
                                                </td>
                                                <td align="center">
                                                    {treatment.duration}
                                                </td>
                                                <td colSpan="2">
                                                    {!this.state.treatmentMap.has(treatment.code) &&
                                                        <a href="#" onClick={() => this.useStdTreatment(`${treatment.code}`)}>
                                                            <FaCheckSquare />use
                                                        </a>
                                                    }
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                <br />
                                <br />
                            </div>

                            <div className="div-flex-table-right">
                                <FormGroup>
                                    <Col componentClass={ControlLabel} sm={20}>
                                        <div className="div-title">
                                            <b>Country customized treatments</b> ({this.state.filteredTreatments.length})
                                        </div>
                                        <hr />
                                    </Col>
                                </FormGroup>
                                <div className="filter-container">
                                    <div>
                                        <FormGroup>
                                            <FormControl
                                                componentClass="select"
                                                onChange={e => this.filterCountryTreatement(e.target.value)}>
                                                <option value="0" key="000">Filter by cadre</option>
                                                {this.state.countryCadres.map(cadre =>
                                                    <option
                                                        key={cadre.std_code}
                                                        value={cadre.std_code}>
                                                        {cadre.name_fr + '/' + cadre.name_en}
                                                    </option>
                                                )}
                                            </FormControl>
                                        </FormGroup>
                                    </div>

                                    <div>
                                        <FormGroup>
                                            <Col sm={15}>
                                                <input typye="text" className="form-control"
                                                    placeholder="Filter by treatment" onChange={e => this.filterCountryTreatment(e.target.value)} />
                                            </Col>
                                        </FormGroup>
                                    </div>
                                </div>

                                <hr />
                                <table className="table-list">
                                    <thead>
                                        <tr>
                                            <th>Standard name</th>
                                            <th>Customized name</th>
                                            <th>Duration (min)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.filteredTreatments.map(treatment =>
                                            <tr key={treatment.code} >
                                                <td>
                                                    {treatment.name_std}
                                                </td>
                                                <td>
                                                    <div>
                                                        <a href="#">
                                                            <InlineEdit
                                                                validate={this.validateTextValue}
                                                                activeClassName="editing"
                                                                text={(treatment.name_cust.length == 0) ? 'customize' : treatment.name_cust}
                                                                paramName={treatment.code + '|name_customized'}
                                                                change={this.handleTreatmentChange}
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
                                                <td align="center">
                                                    <div>
                                                        <a href="#">
                                                            <InlineEdit
                                                                validate={this.validateTextValue}
                                                                activeClassName="editing"
                                                                text={`` + treatment.duration}
                                                                paramName={treatment.code + '|duration'}
                                                                change={this.handleTreatmentChange}
                                                                style={{
                                                                    minWidth: 100,
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
                                                    <a href="#" onClick={() => this.deleteTreatment(`${treatment.code}`)}>
                                                        <FaTrash />
                                                    </a>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                <br /><br />
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        )
    }

};