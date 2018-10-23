import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button, Table } from 'react-bootstrap';
import axios from 'axios';

export default class FacilityPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dhis2_facilities:[],
            dhis2_facilityInput:[],
            dhis2_facilityDict:{},
            dhis2_facilityFilter:"",
            dhis2_facilityToggle:true,
            dhis2_facilitiesSelected: {},
            cadres: [],
            cadreDict: {},
            cadreInputs: {},
            facilities: [],
            selectedFacility: 0,
            treatments: [],
            treatmentsSelected: {},
            treatmentFilter: "",
            treatmentToggle: true,
            state: 'form',
            results: null,
            progress:''
        };

        this.handleUpload= this.handleUpload.bind(this);

        //axios.get('/dhis2/import').then(res => {
        axios.get('/user/facilities').then(res => {
            //let facilities = res.data;
            let facilities = res.data;
            console.log(facilities);
            
            let dhis2_facilityInput = {};
            let dhis2_facilityDict = {};
            //let id=0;
            facilities.forEach(facility => {
                dhis2_facilityInput[facility.Id] = {
                    selected:facility.selected,
                    id:facility.Id,
                    region: facility.regionName,
                    district: facility.districtName,
                    name: facility.Name
                }
                dhis2_facilityDict[facility.Id] = facility.Name;
                
            });

            this.setState({
                dhis2_facilities: facilities,
                dhis2_facilityDict: dhis2_facilityDict,
                dhis2_facilityInput: dhis2_facilityInput
            });
        }).catch(err => console.log(err));

        axios.get('/user/cadres').then(res => {
            let cadres = res.data;

            let cadreInputs = {};
            let cadreDict = {};
            cadres.forEach(cadre => {
                cadreInputs[cadre.id] = {
                    selected: true,
                    hours: 40,
                    adminPercentage: 15
                }
                cadreDict[cadre.id] = cadre.name;
            });

            this.setState({
                cadres: cadres,
                cadreDict: cadreDict,
                cadreInputs: cadreInputs
            });
        }).catch(err => console.log(err));

        axios.get('/user/facilities')
            .then(res => this.setState({ facilities: res.data }))
            .catch(err => console.log(err));

        axios.get('/user/treatments')
            .then(res => {
                let treatments=res.data;

                let treatmentsSelected = {};
                res.data.forEach(treatment => {
                    treatmentsSelected[treatment.id] = true
                });
                this.setState({
                    treatments: treatments,
                    treatmentsSelected: treatmentsSelected
                });
            })
            .catch(err => console.log(err));

    }

    filterFacility(){
        return this.state.dhis2_facilities.filter(facility =>{
            let name=facility.Name.toUpperCase();
            let filter=this.state.dhis2_facilityFilter.toUpperCase();
            return name.indexOf(filter) > -1;
        });
    }
    toggleFacilities() {
        let dhis2_facilityToggle = !this.state.dhis2_facilityToggle;
        let dhis2_facilitiesSelected = this.state.dhis2_facilitiesSelected;
        this.state.dhis2_facilities.forEach(facility => {
            dhis2_facilitiesSelected[facility.Id] = dhis2_facilityToggle;
        })

        this.setState({
            dhis2_facilityToggle: dhis2_facilityToggle,
            facilitiesSelected: dhis2_facilitiesSelected
        });
    }
    facilityCheckboxChanged(id,_selected) {

        let selected=(_selected==0)?1:0;

        let data={selected:selected}

        axios.patch('/user/facilities/'+id, data).then(res => {
            //this.state.dhis2_facilities[id]=selected;
            let facilitiesSelected = this.state.dhis2_facilities;
            facilitiesSelected[id].selected=selected;
            this.setState({ facilitiesSelected: this.state.dhis2_facilities});
        }).catch(err => console.log(err));
    }

    calculateClicked() {

        // set state to loading
        this.setState({ state: 'loading' });

        // add timeout so loading animation looks better
        setTimeout(() => {
            // get input from forms and put it in a data object
            let data = {
                facilityId: this.state.selectedFacility,
                cadres: {},
                treatments: this.state.treatmentsSelected
            };


            this.state.cadres.forEach(cadre => {
                if (this.state.cadreInputs[cadre.id].selected) {
                    data.cadres[cadre.id] = {
                        hours: parseFloat(this.state.cadreInputs[cadre.id].hours),
                        adminPercentage: parseFloat(this.state.cadreInputs[cadre.id].adminPercentage)
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

    handleUpload(ev) {

        ev.preventDefault();
    
        const data = new FormData();
        data.append('file', this.uploadInput.files[0]);
        data.append('type', 'fac');
  
      axios.post('/dhis2/upload', data,
      {
        onUploadProgress: progressEvent => {
            var prog=(progressEvent.loaded / progressEvent.total)*100;
            var pg=(prog < 100)?prog.toFixed(2):prog.toFixed(0);
            this.setState({progress:pg});
            //console.log(pg+"%");
      }})
        .then((result) => {
           //console.log(result.data);
           this.setState({progress:result.data});
      }).catch(err=>console.log(err));
    }
    
    

    renderForm() {
        return (
            <Form horizontal>
            <form onSubmit={this.handleUpload}>
                <div>
                <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
                </div>
                <br />
                <div><span>
                    <button>Upload</button><span> {this.state.progress}</span>
                </span>
                </div>
                
            </form>
               <hr />
                <FormGroup>
                    <Col componentClass={ControlLabel} sm={2}>Facilities</Col>
                    <Col sm={10}>
                        <Row>
                            <Col xs={3}>
                                <FormControl
                                    type="text"
                                    placeholder="filter facility"
                                    value={this.state.dhis2_facilityFilter}
                                    onChange={e => this.setState({ dhis2_facilityFilter: e.target.value })} />
                                <div style={{ textAlign: "right", paddingTop: 5 }}>
                                    <Button bsStyle="primary" bsSize="small" onClick={() => this.toggleFacilities()}>
                                        {this.state.dhis2_facilityToggle ? "Unselect" : "Select"} All
                                    </Button>
                                </div>
                            </Col>
                            <Col sm={10}>
                                {/*<div style={{ overflowY: "scroll", minHeight: 250, maxHeight: 250 }}>*/}
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                <th style={{ width: "10%" }}>Include</th>
                                                <th style={{ width: "40%" }}>Region</th>
                                                <th style={{ width: "20%" }}>District</th>
                                                <th style={{ width: "30%" }}>Facility</th>
                                                
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.filterFacility().map(facility =>
                                                <tr key={facility.Id}>
                                                    <td>
                                                        <Checkbox
                                                            checked={facility.selected}
                                                            onChange={() => this.facilityCheckboxChanged(facility.Id,facility.selected)} />
                                                    </td>
                                                    <td>
                                                        <h5>{facility.regionName}</h5>
                                                    </td>
                                                    <td>
                                                        <h5>{facility.districtName}</h5>
                                                    </td>
                                                    <td>
                                                        <h5>{facility.Name}</h5>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                {/*</div>*/}
                            </Col>
                        </Row>
                    </Col>
                </FormGroup>
                <hr />
                {/*<FormGroup>
                    <Col componentClass={ControlLabel} sm={2}>Facilities</Col>
                    <Col sm={10}>
                        <Table striped hover>
                            <thead>
                                <tr>
                                    <th style={{ width: "10%" }}>Include</th>
                                    <th style={{ width: "40%" }}>Region</th>
                                    <th style={{ width: "20%" }}>District</th>
                                    <th style={{ width: "30%" }}>Facility</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.dhis2_facilities.map(facility =>
                                    <tr key={facility.id}>
                                        <td>
                                            <Checkbox
                                                checked={this.state.dhis2_facilityInput[facility.id].selected}
                                                onChange={() => this.cadreCheckboxChange(facility.id)}
                                            />
                                        </td>
                                        <td>
                                            <h5>{this.state.dhis2_facilityInput[facility.id].region}</h5>
                                        </td>
                                        <td>
                                            <h5>{this.state.dhis2_facilityInput[facility.id].district}</h5>
                                        </td>
                                        <td>
                                            <h5>{this.state.dhis2_facilityInput[facility.id].name}</h5>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </FormGroup>*/}
                
                <div style={{ textAlign: "right", paddingTop: 10 }}>
                    <Button bsStyle="warning" bsSize="small" onClick={() => this.calculateClicked()}>Import</Button>
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
                                    <h4 key={cadreId + 'needed'}>{Math.round(this.state.results.workersNeeded[cadreId] + .49999)}</h4>
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