import * as React from 'react';
import Collapsible from 'react-collapsible';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Row, Radio, Checkbox, Table } from 'react-bootstrap';
import * as axios from 'axios';
import { Route, Redirect, Switch, Link } from 'react-router-dom';


import NewTreatmentComponent from './NewTreatmentComponent';
import TreatmentComponent from './TreatmentComponent';
import BulkAddingComponent from './BulkAddingComponent';
import FromCSVComponent from './FromCSVComponent';

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
            showingAddFromCSV:false,
            showingNewStep: false,
            treatmentSteps: [],
            treatmentFilter: "",
            treatment_stats: {},
        };

        axios.get('/user/selected_facilities') .then(res => {

            this.setState({ facilities: res.data});
            
        }).catch(err => {
            if(err.response.status === 401){
                this.props.history.push(`/login`);
            }
        });

        axios.get('/admin/activities_cadres')
            .then(res => { 
                this.setState({ treatments_cadres: res.data });
            }).catch(err => {
                if(err.response.status === 401){
                    this.props.history.push(`/login`);
                }
            });
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

        }).catch(err => {
            if(err.response.status === 401){
                this.props.history.push(`/login`);
            }
        });

        axios.get('/user/cadres').then(res => {
            let cadres = res.data;
            this.setState({
                cadres: cadres,
            });
        }).catch(err => {
            if(err.response.status === 401){
                this.props.history.push(`/login`);
            }
        });

    }
    deleteTreatment(id) {
        //console.log(id);
        axios.delete(`/admin/activities_cadres/${id}`).then(() => {
   
            let treatments_cadres = this.state.treatments_cadres;
            delete treatments_cadres[id];
            this.setState({ treatments_cadres: treatments_cadres });
        }).catch(err => {
            if(err.response.status === 401){
                this.props.history.push(`/login`);
            }
        });
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

        }).catch(err => {
            if(err.response.status === 401){
                this.props.history.push(`/login`);
            }
        });
    }

    saveTreatmentsCadre(info) {

        info.selectedTreatments.map(treatment => {

            let duration=0;

            let data = {

                cadreId: info.cadreId,
    
                treatmentId: treatment.id
            }

            axios.post(`/admin/activities_cadres/${duration}`, data).then(res => {

                let treatments_cadres = this.state.treatments_cadres;
    
                treatments_cadres[res.data.id] = res.data;
    
                this.setState({ treatments_cadres: treatments_cadres });
    
            }).catch(err => {
                if(err.response.status === 401){
                    this.props.history.push(`/login`);
                }
            });
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

            if(res.status !== 401){
                this.props.history.push(`/login`);
            }
            this.setState({ treatment_stats: res.data });

        }).catch(err => {
            if(err.response.status === 401){
                this.props.history.push(`/login`);
            }
        });
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
            <div style={{marginLeft:10, marginRight:10}}>
                
                    <div className="div-top-link" style={{ textAlign: "right", paddingBottom: 4, paddingTop: 10 }}>
                        
                        {
                            !this.state.showingBulkAdding && !this.state.showingAddFromCSV &&
                            <a href="#" onClick={() => this.setState({ showingBulkAdding: true })}>
                                    Bulk add treatments to cadre
                            </a>
                        }

                        {
                            !this.state.showingBulkAdding &&  !this.state.showingAddFromCSV &&
                            <a href="#" onClick={() => this.setState({ showingNewTreatment: true })}>
                                Add single treatment to cadre
                            </a>
                        }
                        {
                            !this.state.showingBulkAdding && !this.state.showingAddFromCSV &&
                            <a href="#" onClick={() => this.setState({ showingAddFromCSV: true })}>
                                Add time from csv file
                            </a>
                        }
                    </div>
                    {
                        //Show add from csv
                        this.state.showingAddFromCSV &&
                        <FromCSVComponent
                            cadres={this.state.cadres}
                            treatments={this.state.treatments}
                            treatments_cadres={this.state.treatments_cadres}
                            save={info => this.saveTreatmentsCadre(info)}
                            cancel={() => this.setState({ showingAddFromCSV: false })} />
                    }
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
                    {
                        !this.state.showingAddFromCSV && !this.state.showingBulkAdding &&
                    <div>
                        <FormControl type="text" placeholder="filter by cadres" value={this.state.treatmentFilter}
                            onChange={e => this.setState({ treatmentFilter: e.target.value })} />

                    </div>
                   
                    }
                    <br />
                    {
                        !this.state.showingAddFromCSV &&  !this.state.showingBulkAdding &&
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
                }
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