import * as React from 'react';
import Collapsible from 'react-collapsible';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Row, Radio, Checkbox, Table } from 'react-bootstrap';
import * as axios from 'axios';
import { Route, Redirect, Switch, Link } from 'react-router-dom';

import NewTreatmentComponent from './NewTreatmentComponent';
import TreatmentComponent from './TreatmentComponent';
import BulkAddingComponent from './BulkAddingComponent';

import { CSVLink, CSVDownload } from "react-csv";

export default class TreatmentPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            message: 'ReactInline demo',
            cadres: [],
            selectedOption: "",
            cadreId: 0,
            years: ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022"],
            selectedPeriod: "",
            selectedFacility: "",
            selectedCadre: 0,
            facilities: [],
            treatments_cadres: {},
            treatments: [],
            showingNewTreatment: false,
            showingBulkAdding: false,
            showingNewStep: false,
            treatmentSteps: [],
            treatmentFilter: "",
            treatment_stats: {},
            /*csvData:[
                ["firstname", "lastname", "email"],
                ["Ahmed", "Tomi", "ah@smthing.co.com"],
                ["Raed", "Labes", "rl@smthing.co.com"],
                ["Yezzi", "Min l3b", "ymin@cocococo.com"]
            ]*/

            headers: [
                { label: "Activity Name", key: "Activity" }
            ],
            /*csvData:[
                  { firstname: "Ahmed", lastname: "Tomi", email: "ah@smthing.co.com" },
                  { firstname: "Raed", lastname: "Labes", email: "rl@smthing.co.com" },
                  { firstname: "Yezzi", lastname: "Min l3b", email: "ymin@cocococo.com" }
            ],*/
            csvData: [],
        };

        axios.get('/user/selected_facilities')
            .then(res => this.setState({ facilities: res.data }))
            .catch(err => console.log(err));

        axios.get('/admin/activities_cadres')
            .then(res => this.setState({ treatments_cadres: res.data }))
            .catch(err => console.log(err));
        /*axios.get('/admin/treatments').then(res => this.setState({ treatments: res.data }))
            .catch(err => console.log(err));*/
        axios.get('/admin/activities').then(res => {
            let treatments = res.data;
            let csvData = res.data;

            this.setState({
                treatments: treatments,
                csvData: csvData,
            });

            //console.log(this.state.csvData);

        }).catch(err => console.log(err));

        axios.get('/user/cadres').then(res => {
            let cadres = res.data;
            this.setState({
                cadres: cadres,
            });
        }).catch(err => console.log(err));

    }

    componentWillReceiveProps(newProps) {
        // update our treatments incase one was edited
        if (newProps.location != this.props.location
            && newProps.location.pathname.endsWith("admin")) {
            axios.get('/admin/activities')
                .then(res => this.setState({ treatments: res.data }))
                .catch(err => console.log(err));
        }
    }
    deleteTreatment(id) {
        //console.log(id);
        axios.delete(`/admin/activities_cadres/${id}`).then(() => {
            let treatments_cadres = this.state.treatments_cadres;
            delete treatments_cadres[id];
            this.setState({ treatments_cadres: treatments_cadres });
        }).catch(err => console.log(err));
    }


    newTreatmentSave(info) {

        let treatmentId = info.treatmentId;

        let cadreId = info.cadreId;

        let duration = info.duration;

        this.setState({ showingNewTreatment: false });

        let data = {

            cadreId: cadreId,

            treatmentId: treatmentId
        }
        axios.post(`/admin/activities_cadres/${duration}`, data).then(res => {

            let treatments_cadres = this.state.treatments_cadres;

            treatments_cadres[res.data.id] = res.data;

            this.setState({ treatments_cadres: treatments_cadres });

        }).catch(err => console.log(err));
    }

    saveTreatmentsCadre(info) {

        info.selectedTreatments.map(treatment => {

            let duration=1;

            let data = {

                cadreId: info.cadreId,
    
                treatmentId: treatment.id
            }

            axios.post(`/admin/activities_cadres/${duration}`, data).then(res => {

                let treatments_cadres = this.state.treatments_cadres;
    
                treatments_cadres[res.data.id] = res.data;
    
                this.setState({ treatments_cadres: treatments_cadres });
    
            }).catch(err => console.log(err));
        });
        this.setState({ showingBulkAdding: false }); 
        
    }


    showTreatmentStats() {

        let facilityCode = this.state.selectedFacility;

        let cadreId = this.state.selectedCadre;

        let period = this.state.selectedPeriod;

        axios.get(`/admin/activities_stats`, {
            params: {
                cadreId: cadreId,
                facilityCode: facilityCode,
                period: period
            }
        }).then(res => {

            this.setState({ treatment_stats: res.data });

        }).catch(err => console.log(err));
    }

    downloadFile() {

        setTimeout(() => {
            const response = {
                file: 'http://drc.ihris.org/managedrc/rapport_maniema.csv',//get this from server
            };
            // server sent the url to the file!
            // now, let's download:
            window.location.href = response.file;
            // you could also do:
            // window.open(response.file);
        }, 100);
    }

    importDHIS2DataValues() {

        // add timeout so loading animation looks better
        setTimeout(() => {
            // get input from forms and put it in a data object
            let data = {
                facilityId: this.state.selectedFacility,
                selectedPeriod: this.state.selectedPeriod,
                cadreId: this.state.selectedCadre,
            };
            // send the calculate workforce request
            axios.post('/dhis2/import_values', data).then(res => {
                this.setState({
                    results: res.data,
                    state: 'results'
                });
                //this.state.results=res.data;

            }).catch(err => console.log(err));
        }, 400);
    }

    filterTreatments() {
        return this.state.treatments_cadres.filter(t => {
            let cadre = t['cadre'].toUpperCase();
            let filter = this.state.treatmentFilter.toUpperCase();
            return this.state.treatments_cadres.indexOf(filter) > -1;
        });
    }
    handleOptionChange(ev) {

        this.setState({
            selectedOption: ev.target.value
        });
        console.log(this.state.selectedOption);
    }

    renderTreatments() {

        return ([
            <div>
                <Collapsible trigger="Time on treatments">
                    <div style={{ textAlign: "right", paddingBottom: 4, paddingTop: 10 }}>
                        
                        {
                            !this.state.showingBulkAdding &&
                            <a href="#" onClick={() => this.setState({ showingBulkAdding: true })}>
                                    Bulk add treatments to cadre
                            </a>
                        }
                        &nbsp;{"|"}&nbsp;
                        {
                            !this.state.showingBulkAdding &&   
                            <a href="#" onClick={() => this.setState({ showingNewTreatment: true })}>
                                Add treatment to cadre
                            </a>
                        }

                    </div>
                    {
                        //Show the add in bulk form
                        this.state.showingBulkAdding &&
                        <BulkAddingComponent
                            cadres={this.state.cadres}
                            treatments={this.state.treatments}
                            treatments_cadres={this.state.treatments_cadres}
                            save={info => this.saveTreatmentsCadre(info)}
                            cancel={() => this.setState({ showingBulkAdding: false })} />
                    }
                    <br />
                    <div>
                        <FormControl type="text" placeholder="filter by cadres" value={this.state.treatmentFilter}
                            onChange={e => this.setState({ treatmentFilter: e.target.value })} />

                    </div>
                    <br />
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th style={{ width: "40%" }}>Treatment</th>
                                <th style={{ width: "20%" }}>Cadre</th>
                                <th style={{ width: "10%" }}>Minutes/patient</th>
                                {/*<th style={{width:"5%"}}>Total duration</th>*/}
                                <th style={{ width: "30%" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(this.state.treatments_cadres).map(id =>
                                <TreatmentComponent
                                    key={id}
                                    id={this.state.treatments_cadres[id].id}
                                    treatment={this.state.treatments_cadres[id].treatment}
                                    cadre={this.state.treatments_cadres[id].cadre}
                                    duration={this.state.treatments_cadres[id].duration}
                                    //duration={this.state.treatments[id].duration}
                                    //manageLink={`/admin/${id}`}
                                    //manage={() => this.manageTreatmentSteps(id)}
                                    delete={() => this.deleteTreatment(this.state.treatments_cadres[id].id)}
                                />
                            )}
                            {
                                this.state.showingNewTreatment &&
                                <NewTreatmentComponent
                                    treatments={this.state.treatments}
                                    cadres={this.state.cadres}
                                    save={info => this.newTreatmentSave(info)}
                                    cancel={() => this.setState({ showingNewTreatment: false })} />
                            }

                        </tbody>
                    </Table>
                </Collapsible>
            </div>,
            <hr />,
            <div>
                <Collapsible trigger="Import yearly treatments statistics from DHIS2">

                    <FormGroup>
                        <input type="radio" name="action" value="import" checked={this.state.selectedOption === 'import'} onChange={this.handleOptionChange} />Import&nbsp;&nbsp;
                        <input type="radio" name="action" value="filter" checked={this.state.selectedOption === 'filter'} onChange={this.handleOptionChange} />Filter
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>
                            Period
                            </Col>
                        <Col sm={10}>
                            <FormControl componentClass="select"
                                onChange={e => this.setState({ selectedPeriod: e.target.value })}>
                                {(this.state.years.map((year, i) =>
                                    <option key={i} value={year}>{year}</option>
                                ))}
                            </FormControl>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>
                            Facility
                        </Col>
                        <Col sm={10}>
                            <FormControl componentClass="select"
                                onChange={e => this.setState({ selectedFacility: e.target.value })}>
                                {(this.state.facilities.map((facility, i) =>
                                    <option key={i} value={facility.facilityCode + "|" + facility.id}>{facility.facilityName}</option>
                                ))}
                            </FormControl>
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>
                            Cadres
                        </Col>
                        <Col sm={10}>
                            <FormControl componentClass="select"
                                onChange={e => this.setState({ selectedCadre: e.target.value })}>
                                {(this.state.cadres.map((cadre, i) =>
                                    <option key={i} value={cadre.id}>{cadre.name}</option>
                                ))}
                            </FormControl>
                        </Col>
                    </FormGroup>
                    <div style={{ textAlign: "right", paddingTop: 3, paddingRight: 200 }}>
                        <Button bsStyle="warning" bsSize="small" onClick={() => this.showTreatmentStats()}>View</Button>
                        <Button bsStyle="warning" bsSize="small" onClick={() => this.importDHIS2DataValues()}>Import</Button>
                    </div>

                    <hr />
                    <div>
                        <Collapsible trigger="Treatments statistics">
                            <Table bordered hover>
                                <thead>
                                    <tr>
                                        <th style={{ width: "20%" }}>Treatment</th>
                                        <th style={{ width: "10%" }}>Year</th>
                                        <th style={{ width: "30%" }}>Patient count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(this.state.treatment_stats).map(id =>
                                        <tr key={id}>
                                            <td>{this.state.treatment_stats[id].treatment}</td>
                                            <td>{this.state.treatment_stats[id].year}</td>
                                            <td>{this.state.treatment_stats[id].caseCount}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>

                        </Collapsible>
                    </div>
                </Collapsible>
            </div>
        ]
        );
    }
    renderBulk() {
        return (
            <div></div>
        );
    }
    renderTreatment(route) {
        return (
            <div>
                <h3>{this.state.treatments[route.match.params.id].treatment}</h3>
                <Row>
                    <Col xs={10}>
                        <Table bordered hover>
                            <thead>
                                <tr>
                                    <th style={{ width: "50%" }}>Treatment</th>
                                    <th style={{ width: "%" }}>Cadre</th>
                                    <th style={{ width: "15%" }}>Time/patient</th>
                                    <th style={{ width: "20%" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    <tr>
                                        <td>{this.state.treatments[route.match.params.id].treatment}</td>
                                        <td>{this.state.treatments[route.match.params.id].cadre}</td>
                                        <td>{this.state.treatments[route.match.params.id].duration}</td>
                                        <td>
                                            <Button bsStyle="warning"
                                                onClick={() => this.deleteStep(route.match.params.id, step.id)}>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </Table>
                    </Col>

                </Row>
            </div>
        );
    }

    render() {
        return (
            <Switch>
                {Object.keys(this.state.treatments).length == 0 &&
                    <Redirect from="/admin/*" to="/admin" />}
                <Route path='/admin/:id' render={this.renderTreatment.bind(this)} />
                <Route render={this.renderTreatments.bind(this)} />
            </Switch>
        );
    }

};