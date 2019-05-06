import * as React from 'react';
import Collapsible from 'react-collapsible';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import Multiselect from 'react-multiselect-checkboxes';

import toastr from 'toastr';
import 'toastr/build/toastr.min.css'

 
import ResultComponent from './ResultComponent';

export default class WPCPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            facilitiesCombo:[],
            cadresCombo:[],
            cadres: [],
            cadreDict: {},
            cadreInputs: {},
            facilityInputs: {},
            facilityDict: {},
            facilities: [],
            years: [],//Save years to db
            regions:[],
            districts:[],
            selectedPeriod: "",
            selectedFacility: "",
            selectedFacilities:{},
            selectedCadres:{},
            //selectedFacility: 0,
            treatments: [],
            treatmentsSelected: {},
            cadresSelected: {},
            treatmentFilter: "",
            cadreFilter: "",
            facilityFilter: "",
            treatmentToggle: true,
            cadreToggle: true,
            facilityToggle: true,
            state: 'form',
            results: [],
            printable: [],
            data: [],
            showFilters:false,
            filterText:'Show filter',
        };
        this.selectMultipleFacilities = this.selectMultipleFacilities.bind(this);
        this.selectMultipleCadres = this.selectMultipleCadres.bind(this);

        axios.get('/configuration/getYears').then(res =>{
            let years = res.data;
            this.setState({
                years : years
            })
        }).catch(err => console.log(err));

        axios.get('/user/cadres').then(res => {
            let cadres = res.data;

            let cadreInputs = {};
            let cadreDict = {};

            let cadresCombo=[];

            cadres.forEach(cadre => {
                let hours = (cadre.Hours > 0) ? cadre.Hours : 40;
                let admin = (cadre.AdminTask > 0) ? cadre.AdminTask : 15;
                cadreInputs[cadre.id] = {
                    selected: false,
                    hours: hours,
                    adminPercentage: admin
                }
                cadreDict[cadre.id] = cadre.name;

                let id=cadre.id+'|'+cadre.Hours+'|'+cadre.AdminTask

                cadresCombo.push({label:cadre.name, value:id});
            });
            this.setState({
                cadres: cadres,
                cadreDict: cadreDict,
                cadreInputs: cadreInputs,
                cadresCombo:cadresCombo,
            });
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

        axios.get('/user/facilities')
            .then(res => {

                let facilities = res.data;

                let facilityInputs = {};

                let facilityDict = {};

                let facilitiesCombo=[];

                facilities.forEach(fa => {

                    facilityInputs[fa.id] = {
                        name: fa.name,
                        code: fa.code
                    }
                    facilityDict[fa.id] = fa.name;

                    let id=fa.id+'|'+fa.code;

                    facilitiesCombo.push({label:fa.name, value:id});
                });
                this.setState({
                    facilities: facilities,
                    facilityDict: facilityDict,
                    facilityInputs: facilityInputs,
                    facilitiesCombo:facilitiesCombo
                });
            })
            .catch(err => console.log(err));

    }

    selectMultipleCadres(values) {

        let selectedCadres={};
        
        values.forEach(val =>{
            let name=val.label;
            let ident=val.value.split("|");
            let id=ident[0];
            let hours=ident[1];
            let adminPerc=ident[2];

            selectedCadres[id] = {
                hours: parseFloat(hours),
                adminPercentage: parseFloat(adminPerc)
            };
        })
        this.setState({selectedCadres:selectedCadres});
    }

    selectMultipleFacilities(values) {

        let selectedFacilities={};
        
        values.forEach(val =>{

            let name=val.label;
            let ident=val.value.split("|");
            let id=ident[0];
            let code=ident[1];

            selectedFacilities[id] = {
                id:id,
                code:code,
                name:name
            };
        })
        this.setState({selectedFacilities:selectedFacilities});
    }

    facilityCheckboxChanged(id) {

        let facilityInputs = this.state.facilityInputs;

        console.log(facilityInputs);

        facilityInputs[id] = !facilityInputs[id];

        this.setState({ facilityInputs: facilityInputs });

        //console.log(this.state.facilityInputs);
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

    toggleCadres(e) {
        e.preventDefault();
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
    toggleFacilities(e) {
        e.preventDefault();
        let facilityToggle = !this.state.facilityToggle;
        let facilityInputs = this.state.facilityInputs;
        this.state.facilities.forEach(facility => {
            facilityInputs[facility.id] = facilityToggle;
        })

        this.setState({
            facilityToggle: facilityToggle,
            facilityInputs: facilityInputs
        });
    }

    calculateClicked() {
        
        if(this.state.selectedPeriod.length == 0){
            this.launchToastr("Please, select a year first before calculating.");
            return;
        }
        //ALSO TEST facilities and cadres to make sure they are not empty

        this.setState({ results: []}, () => {  //here
           // set state to loading
            this.setState({state: 'loading'});

            let printable = [];
            // add timeout so loading animation looks better
            setTimeout(() => {
                let selectedFacilities = {};

                let datas = {
                    cadres: {},
                    selectedFacilities: {},
                    selectedPeriod: this.state.selectedPeriod
                };
                
                datas.selectedCadres=this.state.selectedCadres;
                datas.selectedFacilities=this.state.selectedFacilities;

                axios.post(`/user/workforce`, datas).then(res => {

                    let values=res.data;

                    Object.keys(values).forEach(id => { 

                            this.state.results.push({

                                facility: values[id].facility,

                                currentWorkers: values[id].currentWorkers,

                                workersNeeded: values[id].workersNeeded,

                                pressure: values[id].pressure
                            })
                    });
                    this.setState({state: 'results'});
                })
                
            }, 1000);
        });  
        
    }

    processResult() {

        let results=this.state.results;

        let printable=[];

        Object.keys(results).forEach(id => {

            let facility="";
            
            let cadre="";

            let curr_workers="";

            let needed_workers="";

            let pressure="";

            Object.keys(results[id].workersNeeded).map(cadreId =>{

                cadre=this.state.cadreDict[cadreId];
                curr_workers=(results[id].currentWorkers[cadreId])?results[id].currentWorkers[cadreId].toString():'0';
                needed_workers=(results[id].currentWorkers[cadreId])?results[id].currentWorkers[cadreId].toString():'0';
                pressure=(results[id].pressure[cadreId])?Number(results[id].pressure[cadreId]).toFixed(2).toString():'0';

                facility=(facility == results[id].facility)?"":results[id].facility;

                printable.push({
                    facility:facility,
                    cadre:cadre,
                    currentWorkers:curr_workers,
                    workersNeeded:needed_workers,
                    pressure:pressure
                });
            });
        });
        this.setState({
            //printable:printable,
            state: 'results'
        });

    }

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

        let url=(districtCode == "000")?'/user/facilities':'/user/facilitiesByDistrict/'+districtCode;

        axios.get(url).then(res => {

                let facilities = res.data;

                let facilityInputs = {};
                let facilityDict = {};

                let facilitiesCombo=[];

                facilities.forEach(fa => {
                    facilityInputs[fa.id] = {
                        name: fa.name,
                        code: fa.code
                    }
                    facilityDict[fa.id] = fa.name;

                    let id=fa.id+'|'+fa.code;

                    facilitiesCombo.push({label:fa.name, value:id});
                });

                this.setState({
                    facilities: facilities,
                    facilityDict: facilityDict,
                    facilityInputs: facilityInputs,
                    facilitiesCombo:facilitiesCombo
                });
            })
            .catch(err => console.log(err));
    }

    toggleFilters(){
        let showFilters = !this.state.showFilters;

        let filterText=(showFilters)?'Hide filter':'Show filter';
        this.setState({
            showFilters:showFilters,
            filterText:filterText
        })
    }

    launchToastr(msg){
        toastr.options = {
          positionClass : 'toast-top-full-width',
          hideDuration: 15,
          timeOut: 6000
        }
        toastr.clear()
        setTimeout(() => toastr.error(msg), 300)
    }

    render() {
        return (
            <div className="calc-container">
                <div className="calc-container-left">
                <Form horizontal>
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
                    <hr />
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={10}>
                            Facilities({(this.state.facilitiesCombo.length)}) [<a href="#" onClick={() => this.toggleFilters()}>{this.state.filterText}</a>]
                        </Col>
                        <Col sm={15}>
                            <Multiselect
                                options={this.state.facilitiesCombo}
                                onChange={this.selectMultipleFacilities}/>
                        </Col>
                        
                        {this.state.showFilters && 
                        
                        <FormGroup>
                            <hr/>
                            <Col componentClass={ControlLabel} sm={10}>
                                Region ({(this.state.regions.length)})
                            </Col>
                            <Col sm={15}>
                                <FormControl componentClass="select" 
                                    onChange={e => this.loadDistrictsByRegion(e.target.value)}>
                                    <option key="000" value="000">Select value</option>
                                    {(this.state.regions.map(rg =>
                                        <option key={rg.code} value={rg.code}>{rg.name}</option>
                                    ))}
                                </FormControl>
                            </Col>
                        </FormGroup>
                    }
                    {this.state.showFilters && 
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={10}>
                                Districts  ({(this.state.districts.length)})
                            </Col>
                            <Col sm={15}>
                                <FormControl componentClass="select" 
                                    onChange={e => this.loadFacilitiesByDistrict(e.target.value)}>
                                    <option key="000" value="000">Select value</option>
                                    {(this.state.districts.map(dist =>
                                        <option key={dist.code} value={dist.code}>{dist.name}</option>
                                    ))}
                                </FormControl>
                            </Col>
                        </FormGroup>
                    } 
                    </FormGroup>
                    <hr />
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={10}>
                            Cadres
                        </Col>
                        <Col sm={15}>
                            <Multiselect
                                    options={this.state.cadresCombo}
                                    onChange={this.selectMultipleCadres}/>
                        </Col>
                    </FormGroup>
                    <hr />
                    <div style={{ textAlign: "right", paddingTop: 10 }}>
                        <Button bsStyle="warning" bsSize="medium" onClick={() => this.calculateClicked()}>Calculate</Button>
                    </div>
                    <br />
                    </Form>
                </div>
                <div className="calc-container-right">
                    {this.state.state == 'loading' &&
                        <div style={{ marginTop: 120, marginBottom: 65 }}>
                            <div className="loader"></div>
                        </div>
                    }
                    {this.state.state == 'results' && 
                        <ResultComponent
                                results={this.state.results}
                                cadreDict={this.state.cadreDict}
                            />
                    }
                </div>
            </div>
            
        );

    }
};