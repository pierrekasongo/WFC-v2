import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Checkbox, Table } from 'react-bootstrap';
import {ToastContainer, ToastStore} from 'react-toasts';

import ActivityList from './ActivityListComponent';

export default class BulkAddingComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            cadreId: Object.keys(props.cadres)[0],
            treatments_cadres:props.treatments_cadres,
            treatmentFilter: "",
            selectedTreatments: [],
            treatmentInputs: {},
            treatmentDict: {},
            treatmentToggle: false,
            treatmentsSelected: {},
        }
    }
    filterTreatments() {
        return this.props.treatments.filter(treatment => {
            let name = treatment['activityName'].toUpperCase();
            let filter = this.state.treatmentFilter.toUpperCase();
            return name.indexOf(filter) > -1;
        });
    }
    toggleTreatments() {
        let treatmentToggle = !this.state.treatmentToggle;
        let treatmentInputs = this.state.treatmentInputs;
        let selectedTreatments = this.state.selectedTreatments;

        this.filterTreatments().forEach(treatment => {
            //treatmentsSelected[treatment.id] = treatmentToggle;
            treatmentInputs[treatment.id] = treatmentToggle;
            if (treatmentToggle) {
                this.state.selectedTreatments.push(treatment);
            } else {
                this.state.selectedTreatments.shift(treatment);
            }
        })

        this.setState({
            treatmentToggle: treatmentToggle,
            treatmentInputs: treatmentInputs,
            selectedTreatments: selectedTreatments
        });
    }

    existInDB(treatmentId){

        let treatments_cadres=this.state.treatments_cadres;

        let cadreId=this.state.cadreId;

        return Object.keys(treatments_cadres).filter(id =>{
            return (treatments_cadres[id].treatmentId == treatmentId && 
                treatments_cadres[id].cadreId == cadreId);
        }).length > 0;        
    }
    treatmentCheckboxChanged(treatment) {

        let treatmentInputs = this.state.treatmentInputs;

        treatmentInputs[treatment.id] = !treatmentInputs[treatment.id];

        if (treatmentInputs[treatment.id]) {

            if(!this.existInDB(treatment.id)){
                 this.state.selectedTreatments.push(treatment);
            }else{
                ToastStore.warning('This treatment has already been added to the selected cadre',10000); 
            }
               
        } else {
            this.state.selectedTreatments.shift(treatment);
        }

        this.setState({ treatmentInputs: treatmentInputs });
    }

    render() {
        return (
            <div>
                <ToastContainer store={ToastStore} position={ToastContainer.POSITION.TOP_CENTER}/>
                <Panel bsStyle="primary" header="Bulk adding treatments to cadres">
                    <FormControl
                        componentClass="select"
                        onChange={e => this.setState({ cadreId: e.target.value })}
                        value={this.state.cadreId}>
                        {Object.keys(this.props.cadres).map(cadre =>
                            <option
                                key={this.props.cadres[cadre].id}
                                value={this.props.cadres[cadre].id}>
                                {this.props.cadres[cadre].name}
                            </option>
                        )}
                    </FormControl>
                </Panel >
                <br />

                <br />
                <div id="main">
                    <div id="d1">
                        <p className="list-notice">{this.filterTreatments().length} treatments.</p>
                        <br/>
                        <FormControl
                            type="text"
                            placeholder="filter treatment"
                            value={this.state.treatmentFilter}
                            onChange={e => this.setState({ treatmentFilter: e.target.value })} />
                            <br/>
                        <Table bordered hover>
                            <thead>
                                <tr>
                                    <th style={{ width: "7%" }}>
                                        <a href="#" onClick={() => this.toggleTreatments()}>All</a>
                                    </th>
                                    <th style={{ width: "43%" }}>Treatment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.filterTreatments().map(treatment =>
                                    <tr key={treatment.id} >
                                        <td>
                                            <Checkbox
                                                //checked={this.state.cadreInputs[cadre.id].selected}
                                                checked={this.state.treatmentInputs[treatment.id]}
                                                onChange={() => this.treatmentCheckboxChanged(treatment)}
                                            />
                                        </td>
                                        <td>
                                            <p>{treatment.activityName}</p>
                                        </td>

                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                    <div id="d3">
                       
                    </div>
                    <div id="d2">
                        <p className="list-notice">{this.state.selectedTreatments.length} treatments.</p>
                        <Table bordered hover>
                            <thead>
                                <tr>
                                    {/*<th style={{ width: "7%" }}></th>*/}
                                    <th >Selected values</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.selectedTreatments.map(treatment =>
                                    <tr key={treatment.id} >
                                        <td>
                                            <p>{treatment.activityName}</p>
                                        </td>

                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </div>
                <div className="div-btn-bulk">
                    <Button bsSize="medium" bsStyle="warning" className="btn-bulk" onClick={() => this.props.cancel()}>Cancel</Button>
                    <Button bsSize="medium" bsStyle="warning" className="btn-bulk" onClick={() => this.props.save(this.state)}>Save</Button>
                </div>
            </div >
        );
    }

}