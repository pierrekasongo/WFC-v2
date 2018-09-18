import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button, Table } from 'react-bootstrap';
import axios from 'axios';

export default class WPCPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            cadres: [],
            cadreDict: {},
            cadreInputs: {},
            facilities: [],
            years:["2014","2015","2016","2017","2018"],
            selectedPeriod:"",
            selectedFacility: "",
            //selectedFacility: 0,
            treatments: [],
            treatmentsSelected: {},
            cadresSelected: {},
            treatmentFilter: "",
            cadreFilter:"",
            treatmentToggle: true,
            cadreToggle:true,
            state: 'form',
            results: null
        };

        axios.get('/user/cadres').then(res => {
            let cadres = res.data;

            let cadreInputs = {};
            let cadreDict = {};
            cadres.forEach(cadre => {
                let hours=(cadre.Hours > 0)?cadre.Hours:40;
                let admin=(cadre.AdminTask > 0)?cadre.AdminTask:15;
                cadreInputs[cadre.id] = {
                    selected: false,
                    hours: hours,
                    adminPercentage: admin
                }
                cadreDict[cadre.id] = cadre.name;
                //cadresSelected[cadre.id]=true;
            });

            this.setState({
                cadres: cadres,
                cadreDict: cadreDict,
                cadreInputs: cadreInputs,
                //cadresSelected:cadresSelected
            });
        }).catch(err => console.log(err));

        axios.get('/user/selected_facilities')
            .then(res => this.setState({ facilities: res.data }))
            .catch(err => console.log(err));

        axios.get('/user/treatments')
            .then(res => {
                let treatmentsSelected = {};
                res.data.forEach(treatment => {
                    treatmentsSelected[treatment.id] = true
                });
                this.setState({
                    treatments: res.data,
                    treatmentsSelected: treatmentsSelected
                });
            })
            .catch(err => console.log(err));

    }

    cadreHoursChanged(e, id) {

        let cadreInputs = this.state.cadreInputs;
        cadreInputs[id].hours = e.target.value;
        this.setState({ cadreInputs: cadreInputs });

        let data = {
            hours: e.target.value,
        };

        axios.patch('/user/cadre/hours/'+id, data).then(res => {
            this.setState({
                results: res.data
            });
            
        }).catch(err => console.log(err));
    }

    cadreAdminAmtChanged(e, id) {
        let cadreInputs = this.state.cadreInputs;
        cadreInputs[id].adminPercentage = e.target.value;
        this.setState({ cadreInputs: cadreInputs });

        let data = {
            admin_task: e.target.value,
        };

        axios.patch('/user/cadre/admin_work/'+id, data).then(res => {
            this.setState({
                results: res.data
            });
            
        }).catch(err => console.log(err));
    }

    filterTreatments() {
        return this.state.treatments.filter(treatment => {
            let name = treatment['treatment'].toUpperCase();
            let filter = this.state.treatmentFilter.toUpperCase();
            return name.indexOf(filter) > -1;
        });
    }

    filterCadres() {
        return this.state.cadres.filter(cadre => {
            let name = cadre['name'].toUpperCase();
            let filter = this.state.cadreFilter.toUpperCase();
            return name.indexOf(filter) > -1;
        });
    }
    treatmentCheckboxChanged(id) {
        let treatmentsSelected = this.state.treatmentsSelected;
        treatmentsSelected[id] = !treatmentsSelected[id];
        this.setState({ treatmentsSelected: treatmentsSelected });
    }

    cadreCheckboxChanged(id) {
        
        let cadreInputs = this.state.cadreInputs;

        cadreInputs[id] = !cadreInputs[id];

        this.setState({ cadreInputs: cadreInputs });
    }
    toggleTreatments() {
        let treatmentToggle = !this.state.treatmentToggle;
        let treatmentsSelected = this.state.treatmentsSelected;
        this.state.treatments.forEach(treatment => {
            treatmentsSelected[treatment.id] = treatmentToggle;
        })

        this.setState({
            treatmentToggle: treatmentToggle,
            treatmentsSelected: treatmentsSelected
        });
    }

    toggleCadres() {
        let cadreToggle = !this.state.cadreToggle;
        let cadreInputs = this.state.cadreInputs;
        this.state.cadres.forEach(cadre => {
            cadreInputs[cadre.id] = cadreToggle;
        })

        this.setState({
            cadreToggle: cadreToggle,
            cadreInputs: cadreInputs
        });
    }

    calculateClicked() {
        // set state to loading
        this.setState({ state: 'loading' });

        //console.log(this.state.cadresSelected);

        // add timeout so loading animation looks better
        setTimeout(() => {
            // get input from forms and put it in a data object
            let data = {
                facilityId: this.state.selectedFacility,
                cadres: {},
                treatments: this.state.treatmentsSelected,
                selectedPeriod:this.state.selectedPeriod
            };
            this.state.cadres.forEach(cadre => {
                if (this.state.cadreInputs[cadre.id]) {
                    data.cadres[cadre.id] = {
                        hours: parseFloat(cadre.Hours),
                        adminPercentage: parseFloat(cadre.AdminTask)
                    };
                }
            });

            // send the calculate workforce request
            axios.post('/user/workforce', data).then(res => {
                this.setState({
                    results: res.data,
                    state: 'results'
                });
                //this.state.results=res.data;
                
            }).catch(err => console.log(err));
        }, 400);
    }

    renderForm() {
        return (
            <Form horizontal>
                <br />
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
                <br />
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
                </FormGroup>
                <hr />
                <FormGroup>
                <Col componentClass={ControlLabel} sm={2}>Enter cadre</Col>
                <Col sm={10}>
                    <Row>
                        <Col xs={3}>
                            <FormControl
                                        type="text"
                                        placeholder="filter cadres"
                                        value={this.state.cadreFilter}
                                        onChange={e => this.setState({ cadreFilter: e.target.value })} />
                                    <div style={{ textAlign: "right", paddingTop: 5 }}>
                                        <Button bsStyle="primary" bsSize="small" onClick={() => this.toggleCadres()}>
                                            {this.state.cadreToggle ? "Unselect" : "Select"} All
                                        </Button>
                                    </div>
                        </Col>
                        <Col xs={9}>
                                <div style={{ overflowY: "scroll", minHeight: 250, maxHeight: 250 }}>
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                <th style={{ width: "10%" }}>Include</th>
                                                <th style={{ width: "40%" }}>Cadre</th>
                                                <th style={{ width: "20%" }}>Hours/Week</th>
                                                <th style={{ width: "30%" }}>Percentage of time spent on administrative tasks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.filterCadres().map(cadre =>
                                                <tr key={cadre.id}>
                                                    <td>
                                                        <Checkbox
                                                            //checked={this.state.cadreInputs[cadre.id].selected}
                                                            checked={this.state.cadreInputs[cadre.id]}
                                                            onChange={() => this.cadreCheckboxChanged(cadre.id)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <h5>{cadre.name}</h5>
                                                    </td>
                                                    <td>
                                                        <FormControl
                                                            type="number"
                                                            style={{ width: 75}}
                                                            disabled={!this.state.cadreInputs[cadre.id]}
                                                            value={cadre.Hours}
                                                            onChange={e => this.cadreHoursChanged(e, cadre.id)} />
                                                    </td>
                                                    <td>
                                                        <FormControl
                                                            type="number"
                                                            style={{ width: 75 }}
                                                            disabled={!this.state.cadreInputs[cadre.id]}
                                                            value={cadre.AdminTask}
                                                            onChange={e => this.cadreAdminAmtChanged(e, cadre.id)} />
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </FormGroup>
                <hr />
                <FormGroup>
                    <Col componentClass={ControlLabel} sm={2}>Enter treatment</Col>
                    <Col sm={10}>
                        <Row>
                            <Col xs={3} >
                                <FormControl
                                    type="text"
                                    placeholder="filter treatments"
                                    value={this.state.treatmentFilter}
                                    onChange={e => this.setState({ treatmentFilter: e.target.value })} />
                                <div style={{ textAlign: "right", paddingTop: 5 }}>
                                    <Button bsStyle="primary" bsSize="small" onClick={() => this.toggleTreatments()}>
                                        {this.state.treatmentToggle ? "Unselect" : "Select"} All
                                    </Button>
                                </div>
                            </Col>
                            <Col xs={9}>
                                <div style={{ overflowY: "scroll", minHeight: 250, maxHeight: 250 }}>
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                <th style={{ width: "15%" }}>Include</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.filterTreatments().map(treatment =>
                                                <tr key={treatment['id']}>
                                                    <td>
                                                        <Checkbox
                                                            checked={this.state.treatmentsSelected[treatment['id']]}
                                                            onChange={() => this.treatmentCheckboxChanged(treatment['id'])} />
                                                    </td>
                                                    <td>
                                                        <h5>{treatment['treatment']}</h5>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </FormGroup>
                <hr />
                <div style={{ textAlign: "right", paddingTop: 10 }}>
                    <Button bsStyle="warning" bsSize="large" onClick={() => this.calculateClicked()}>Calculate</Button>
                </div>
            </Form >
        );
    }

    renderLoading() {
        return (
            <div style={{ marginTop: 120, marginBottom: 65 }}>
                <div className="loader"></div>
            </div>
        );
    }

    renderResults() {
        return (
            <div>
                <h3>Results</h3>
                <Table hover striped>
                    <thead>
                        <tr>
                            <th>Cadre</th>
                            <th>Current Workers</th>
                            <th>Workers Needed</th>
                            <th>Workforce Pressure</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(this.state.results.workersNeeded).map(cadreId =>
                            <tr>
                                <td>
                                    <h4 key={cadreId + 'cadre'}>{this.state.cadreDict[cadreId]}</h4>
                                </td>
                                <td>
                                    <h4 key={cadreId + 'current'}>{this.state.results.currentWorkers[cadreId]}</h4>
                                </td>
                                <td>
                                    <h4 key={cadreId + 'needed'}>{Math.round(this.state.results.workersNeeded[cadreId] )}</h4>
                                </td>
                                <td>
                                    {this.state.results.pressure[cadreId] &&
                                        <h4
                                            key={cadreId}
                                            style={{ color: this.state.results.pressure[cadreId] < 1 ? "red" : "green" }}>
                                            {Number(this.state.results.pressure[cadreId]).toFixed(2)}x
                                        </h4>
                                    }
                                    {!this.state.results.pressure[cadreId] &&
                                        <h4 key={cadreId} style={{ color: "gray" }}>N/A</h4>
                                    }
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                <br />
                <div style={{ textAlign: "right" }}>
                    <Button onClick={() => this.setState({ state: 'form', results: null })}>Back</Button>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div style={{ width: "85%", margin: "0 auto 0" }}>
                {this.state.state == 'form' && this.renderForm()}
                {this.state.state == 'loading' && this.renderLoading()}
                {this.state.state == 'results' && this.renderResults()}
            </div>
        );
    }

};