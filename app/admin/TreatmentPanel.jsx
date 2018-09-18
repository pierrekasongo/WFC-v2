import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Row, Checkbox, Table } from 'react-bootstrap';
import * as axios from 'axios';
import { Route, Redirect, Switch, Link } from 'react-router-dom';

import NewTreatmentComponent from './NewTreatmentComponent';
import TreatmentComponent from './TreatmentComponent';

export default class TreatmentPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            cadres: [],
            cadreId:0,
            years:["2014","2015","2016","2017","2018"],
            selectedPeriod:"",
            selectedFacility: "",
            selectedCadre:0,
            facilities: [],
            treatments_cadres: {},
            treatments: {},
            showingNewTreatment: false,
            showingNewStep: false,
            treatmentSteps: []
        };

        axios.get('/user/selected_facilities')
            .then(res => this.setState({ facilities: res.data }))
            .catch(err => console.log(err));

        axios.get('/admin/treatments_cadres')
            .then(res => this.setState({ treatments_cadres: res.data }))
            .catch(err => console.log(err));

        /*axios.get('/admin/treatments').then(res => this.setState({ treatments: res.data }))
            .catch(err => console.log(err));*/
        axios.get('/admin/treatments').then(res => {
            let treatments={};
             
            res.data.forEach(treatment => {
                treatments[treatment.Id] = treatment.Treatment;
            });
            this.setState({treatments:treatments});
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
            axios.get('/admin/treatments')
                .then(res => this.setState({ treatments: res.data }))
                .catch(err => console.log(err));
        }
    }
    deleteTreatment(id) {
        //console.log(id);
        axios.delete(`/admin/treatments_cadres/${id}`).then(() => {
            let treatments_cadres = this.state.treatments_cadres;
            delete treatments_cadres[id];
            this.setState({ treatments_cadres: treatments_cadres });
        }).catch(err => console.log(err));
    }

    newTreatmentSave(info) {

        let treatmentId=info.treatmentId;

        let cadreId=info.cadreId;

        let duration=info.duration;

        this.setState({ showingNewTreatment: false });

        let data={

            cadreId:cadreId,

            treatmentId:treatmentId
        }
        axios.post(`/admin/treatments_cadres/${duration}`,data).then(res => {

            let treatments_cadres = this.state.treatments_cadres;

            treatments_cadres[res.data.id] =res.data;

            this.setState({ treatments_cadres: treatments_cadres });

        }).catch(err => console.log(err));
    }
    
    downloadFile(){

        setTimeout(() => {
            const response = {
              file: 'http://drc.ihris.org/managedrc/rapport_maniema.csv',
            };
            // server sent the url to the file!
            // now, let's download:
            window.location.href = response.file;
            // you could also do:
            // window.open(response.file);
          }, 100);
    }

    importValuesClicked() {

        console.log(this.state.selectedFacility+" "+this.state.selectedPeriod+" "+this.state.selectedCadre);

        // add timeout so loading animation looks better
        setTimeout(() => {
            // get input from forms and put it in a data object
            let data = {
                facilityId: this.state.selectedFacility,
                selectedPeriod:this.state.selectedPeriod,
                cadreId:this.state.selectedCadre,
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

    renderTreatments() {
        return ([
            <div>
                <div style={{ textAlign: "right", paddingBottom: 4,paddingTop:10 }}>
                    <Button bsStyle="success"
                        disabled={this.state.showingNewTreatment}
                        onClick={() => this.setState({ showingNewTreatment: true })}>
                        Add treatment to cadre
                    </Button>
                </div>
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
                                treatment={this.state.treatments_cadres[id].treatment}
                                cadre={this.state.treatments_cadres[id].cadre}
                                duration={this.state.treatments_cadres[id].duration}
                                //duration={this.state.treatments[id].duration}
                                //manageLink={`/admin/${id}`}
                                //manage={() => this.manageTreatmentSteps(id)}
                                delete={() => this.deleteTreatment(this.state.treatments_cadres[id].id)}
                            />
                        )}
                        {this.state.showingNewTreatment &&
                            <NewTreatmentComponent
                                treatments={this.state.treatments}
                                cadres={this.state.cadres}
                                save={info => this.newTreatmentSave(info)}
                                cancel={() => this.setState({ showingNewTreatment: false })} />}
                    </tbody>
                </Table>
            </div>,
            <hr/>,
            <div >
                <span><h5 >Import treatments values from DHIS2</h5></span>      
            </div>,
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
            </FormGroup>,
            <FormGroup>
                <Col componentClass={ControlLabel} sm={2}>
                    Facility
                </Col>
                <Col sm={10}>
                    <FormControl componentClass="select"
                        onChange={e => this.setState({ selectedFacility: e.target.value })}>
                        {(this.state.facilities.map((facility, i) =>
                            <option key={i} value={facility.FacilityCode}>{facility.Name}</option>
                        ))}
                    </FormControl>
                </Col>
            </FormGroup>,
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
            </FormGroup>,
            <div style={{ textAlign: "right", paddingTop: 10 }}>
                <Button bsStyle="warning" bsSize="small" onClick={() => this.importValuesClicked()}>Import</Button>
            </div>
         ]
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