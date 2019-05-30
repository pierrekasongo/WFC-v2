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
            filteredDhis2Treatments: [],
            dhis2AssignedTreatments: [],
            dhis2TreatmentCombo:[],
            selectedDhis2Treatments:[],
            selectedStdCadre: '',
            selectedCountryCadre: '',
            progress: '',
            treatmentToDelete: 0,
            treatmentToMatch: "",
            treatmentMap: new Map(),
        };
        this.handleUploadTreatment = this.handleUploadTreatment.bind(this);
        this.selectMultipleDhis2Treatments = this.selectMultipleDhis2Treatments.bind(this);
        axios.get('/metadata/cadres').then(res => {

            this.setState({ stdCadres: res.data });

        }).catch(err => console.log(err));

        axios.get('/dhis2/get_treatments').then(res => {

            let dhis2AssignedTreatments = [];

            let dhis2TreatmentCombo=[];

            res.data.forEach(tr => {
                dhis2AssignedTreatments[tr.code] = false;
                dhis2TreatmentCombo.push({label:tr.name, value:tr.code});
            })
            this.setState({
                dhis2Treatments: res.data,
                dhis2TreatmentCombo:dhis2TreatmentCombo,
                dhis2AssignedTreatments: dhis2AssignedTreatments
            });

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

    handleUploadTreatment(ev) {

        ev.preventDefault();

        const data = new FormData();

        data.append('file', this.uploadTreatmentInput.files[0]);

        if (this.uploadTreatmentInput.files.length == 0) {
            this.launchToastr("No file selected");
            return;
        }

        axios.post('/countrytreatment/uploadTreatments', data,
            {
                onUploadProgress: progressEvent => {
                    var prog = (progressEvent.loaded / progressEvent.total) * 100;
                    var pg = (prog < 100) ? prog.toFixed(2) : prog.toFixed(0);
                    this.setState({ progress: pg });
                }
            })
            .then((result) => {
                this.setState({ progress: result.data });
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

    generateCSV() {

        let selectedStdCadre = this.state.selectedStdCadre;

        const columns = {
            code: 'Std code',
            code_dhis2: 'Dhis2 code',
            std_name: 'Std name',
            cust_name: 'Customized name',
            cadre_code: 'Std cadre code',
            cadre: 'Std cadre name',
            duration: 'Duration',
        };

        axios.get(`/metadata/treatments/${selectedStdCadre}`).then(res => {

            let data = res.data;

            let csvData = [];

            data.forEach(row => {
                csvData.push({
                    code: row.code,
                    code_dhis2: '',
                    std_name: row.name_fr + '/' + row.name_en,
                    cust_name: '',
                    cadre_code: row.cadre_code,
                    cadre: row.cadre,
                    duration: row.duration
                })
            });
            if (csvData.length > 0) {
                downloadCsv(csvData, columns);
            } else {
                this.launchToastr("No data found. Please add some treatments to this cadre.");
            }


        }).catch(err => console.log(err));
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
    matchTreatmentWithDHIS2(){
        
        let data = {
            code:this.state.treatmentToMatch.split("|")[0],
            selectedTreatments:this.state.selectedDhis2Treatments
        };

        axios.patch('/countrytreatment/match_dhis2', data).then(res => {

            axios.get('/dhis2/get_treatments').then(res => {

                let dhis2AssignedTreatments = [];
    
                let dhis2TreatmentCombo=[];
    
                res.data.forEach(tr => {
                    dhis2AssignedTreatments[tr.code] = false;
                    dhis2TreatmentCombo.push({label:tr.name, value:tr.code});
                })
                this.setState({
                    dhis2Treatments: res.data,
                    dhis2TreatmentCombo:dhis2TreatmentCombo,
                    dhis2AssignedTreatments: dhis2AssignedTreatments
                });
    
            }).catch(err => console.log(err));

        }).catch(err => {

        });
    }

    showMatchDialog(code, name, dhis2_code) {

        this.setState({
            treatmentToMatch: code + `|` + name
        });

        let dhis2Code = dhis2_code.split(",");

        dhis2Code.forEach(cd => {
            this.state.dhis2AssignedTreatments[cd] = true;
        })
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='match-dialog'>
                        <h3><b>Match to DHIS2</b></h3>
                        <p>Treatment: {this.state.treatmentToMatch.split('|')[1]}</p>
                        
                        <hr />
                        <div>
                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={10}>
                                    <b>Dhis2 treatments({(this.state.dhis2TreatmentCombo.length)})</b>
                                </Col>
                                <Col sm={30}>
                                        <Multiselect
                                            options={this.state.dhis2TreatmentCombo}
                                            onChange={this.selectMultipleDhis2Treatments} />
                                </Col>
                            </FormGroup>
                        </div>
                        <hr/>
                        {/*<div className="div-table">
                            <table className="table-list">
                                <thead>
                                    <th>Code</th>
                                    <th>Treatment</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    {this.state.filteredDhis2Treatments.map(tr =>
                                        <tr>
                                            <td>{tr.code}</td>
                                            <td>{tr.name}</td>
                                            <td>
                                                {!this.state.dhis2AssignedTreatments[tr.code] &&
                                                    <a href="#" className="add-new-link" onClick={() => this.matchTreatmentWithDHIS2()}>
                                                        <FaCheckSquare />
                                                    </a>
                                                }

                                                {this.state.dhis2AssignedTreatments[tr.code] &&
                                                    <a href="#" className="cancel-link" onClick={() => this.setState({ showingNewCadre: true, isEditCadre: false, selectedCadre: '' })}>
                                                        <FaTrash />
                                                    </a>
                                                }
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>*/}
                        <button className="dialog-button" onClick={onClose}>Close</button> &nbsp;&nbsp;&nbsp;
                        <button className="dialog-button" onClick={() => this.matchTreatmentWithDHIS2}>Match</button>
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

            var cadre = stdTreatment.cadre;

            let name = stdTreatment.name_fr + "/" + stdTreatment.name_en;

            let duration = stdTreatment.duration;

            let data = {
                code: code,
                cadre_code: cadre_code,
                name: name,
                duration: duration,
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

    selectMultipleDhis2Treatments(values) {

        let selectedDhis2Treatments = [];

        values.forEach(val => {

            let name = val.label;

            let code = val.value;

            selectedDhis2Treatments.push({
                code: code,
                name: name
            })
        })
        this.setState({selectedDhis2Treatments:selectedDhis2Treatments});
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
                                <hr />
                                <div class="alert alert-warning" role="alert">
                                    <p>Generate a template file to be customized and imported at <br />the right side for your country.</p>
                                    <p>Before import, you can set or change values for following field in the file:</p>
                                    <ul>
                                        <li>Dhis2 code (comma separated)</li>
                                        <li>Customized name</li>
                                        <li>Duration</li>
                                    </ul>
                                </div>
                                <Button bsSize="medium" bsStyle="warning" onClick={() => this.generateCSV()}><FaFileCsv /> Generate csv file</Button>
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
                                            <th>Dhis2 code
                                                <a data-tip data-for='code-help'> <FaQuestion /> </a>
                                                <ReactTooltip id='code-help' place='top' type='warning' effect='solid'>
                                                    <span>Separate multiple codes with a comma(,)</span>
                                                </ReactTooltip>
                                            </th>
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
                                                <td>
                                                    <a href="#" onClick={() => this.showMatchDialog(treatment.code, treatment.name_std, treatment.dhis2_code)}>
                                                        {(treatment.dhis2_code.length > 0) ? "View" : "Match"}
                                                    </a>

                                                    {/*<div>
                                                        <a href="#">
                                                            <InlineEdit
                                                                validate={this.validateTextValue}
                                                                activeClassName="editing"
                                                                text={(treatment.dhis2_code.length == 0) ? 'match code' : treatment.dhis2_code}
                                                                paramName={treatment.code + '|dhis2_code'}
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
                                                    </div>*/}
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
                                <hr />
                                <Form horizontal>
                                    <div>
                                        <div class="alert alert-warning" role="alert">
                                            <p>Make sure it's a csv file with following headers and order. <br />
                                                Also note that every duplicate code will update the existing value.<br /></p>
                                            <p><b>"Std code","Dhis2 code","Std name", "Customized name", "Std cadre code",
                                                "Std cadre name", "Duration"</b></p>
                                        </div>
                                        <form onSubmit={this.handleUploadTreatment}>
                                            <div class="upload-btn-wrapper">
                                                <button class="btn"><FaFolderOpen /> Choose file...</button>
                                                <input ref={(ref) => { this.uploadTreatmentInput = ref; }} type="file" />
                                            </div>
                                            <br />
                                            <br />
                                            <div>
                                                <span>
                                                    <button className="button"><FaCloudUploadAlt /> Upload file</button><span> {this.state.progress}</span>
                                                </span>
                                            </div>
                                        </form>

                                    </div>
                                </Form >
                                <br /><br />
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        )
    }

};