import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Checkbox, Table } from 'react-bootstrap';
import { Route, Redirect, Switch, Link } from 'react-router-dom';
import Collapsible from 'react-collapsible';
import * as axios from 'axios';

export default class StatisticsPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            years: [],//Save years to db
            selectedPeriod: "",
            selectedFacility: "",
            selectedCadre: 0,
            regions:[],
            districts:[],
            facilities: [],
            cadres:[],
            cadreId:0,
            selectedCadre: 0
        };
        axios.get('/configuration/getYears').then(res =>{

            console.log(res.data);
            
            let years = res.data;
            this.setState({
                years : years
            })
        }).catch(err => console.log(err));

        axios.get('/user/regions').then(res => {
            let regions = res.data;
            this.setState({
                regions: regions,
            });
        }).catch(err => console.log(err));

        axios.get('/user/districts').then(res => {
            let districts = res.data;
            this.setState({
                districts: districts,
            });
        }).catch(err => console.log(err));
        axios.get('/user/selected_facilities')
            .then(res => this.setState({ facilities: res.data }))
            .catch(err => console.log(err));

        axios.get('/user/cadres').then(res => {
            let cadres = res.data;
            this.setState({
                cadres: cadres,
            });
        }).catch(err => console.log(err));
    };
    loadDistrictsByRegion(regionCode){

        let url=(regionCode == "000")?'/user/districts':'/user/districtsByRegion/'+regionCode;
        
        axios.get(url).then(res => {
            let districts = res.data;
            this.setState({
                districts: districts,
            });
        }).catch(err => console.log(err));
    }

    loadFacilitiesByDistrict(districtCode){

        let url=(districtCode == "000")?'/user/selected_facilities':'/user/selected_facilitiesByDistrict/'+districtCode;

        axios.get(url)
            .then(res => {
                let facilities = res.data;

                let facilityInputs = {};
                let facilityDict = {};

                facilities.forEach(facility => {
                    facilityInputs[facility.id] = {
                        selected: false,
                        name: facility.facilityName,
                        code: facility.facilityCode
                    }
                    facilityDict[facility.id] = facility.facilityName;
                });
                this.setState({
                    facilities: facilities,
                    facilityDict: facilityDict,
                    facilityInputs: facilityInputs,
                });
            })
            .catch(err => console.log(err));
    }
    render() {
        return (
            <div>
                <Panel bsStyle="primary" header="Import yearly treatments statistics from DHIS2">
                       
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                <b>Period</b>
                            </Col>
                            <Col sm={10}>
                                <FormControl componentClass="select"
                                    onChange={e => this.setState({ selectedPeriod: e.target.value })}>
                                    {(this.state.years.map(yr =>
                                        <option key={yr.id} value={yr.year}>{yr.year}</option>
                                    ))}
                                </FormControl>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                <b>Region ({(this.state.regions.length)})</b>
                            </Col>
                            <Col sm={5}>
                                <FormControl componentClass="select" 
                                    onChange={e => this.loadDistrictsByRegion(e.target.value)}>
                                    <option key="000" value="000">Select value</option>
                                    {(this.state.regions.map(rg =>
                                        <option key={rg.code} value={rg.code}>{rg.name}</option>
                                    ))}
                                </FormControl>
                            </Col>
                        </FormGroup>
                    
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                <b>Districts  ({(this.state.districts.length)})</b>
                            </Col>
                            <Col sm={5}>
                            <FormControl componentClass="select" 
                                onChange={e => this.loadFacilitiesByDistrict(e.target.value)}>
                                {(this.state.districts.map(dist =>
                                    <option key={dist.code} value={dist.code}>{dist.name}</option>
                                ))}
                            </FormControl>
                                {/*<FormControl componentClass="select">
                                </FormControl>*/}
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                            <b>Facility  ({(this.state.facilities.length)})</b>
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
                                <b>Cadres</b>
                            </Col>
                            <Col sm={10}>
                                <FormControl
                                            componentClass="select"
                                            onChange={e => this.setState({ cadreId: e.target.value })}
                                            value={this.state.cadreId}>
                                            {Object.keys(this.state.cadres).map(cadre =>
                                                <option
                                                    key={this.state.cadres[cadre].id}
                                                    value={this.state.cadres[cadre].id}>
                                                    {this.state.cadres[cadre].name}
                                                </option>
                                            )}
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
                                       
                                    </tbody>
                                </Table>

                            </Collapsible>
                        </div>
                </Panel>
                
            </div>
        );
    }

};