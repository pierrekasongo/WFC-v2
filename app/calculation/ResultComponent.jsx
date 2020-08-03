import * as React from 'react';
import Collapsible from 'react-collapsible';
//import Button from 'react-bootstrap/Button'
import {Button,Table, FormGroup,Checkbox } from 'react-bootstrap';


import ResultExcelComponent from './ResultExcelComponent';

export default class ResultComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            cadreDict: props.cadreDict,
            results: props.results,
            dashboardData:new Map()
        };
    }


    saveForDashboard(event,facilityId,cadreId, currentWorkers,neededWorkers){

        let key=`${facilityId}-${cadreId}`;

        if(event.target.checked){

            let value=`${currentWorkers}|${neededWorkers}`;

            if(this.state.dashboardData.has(key)){

                this.state.dashboardData.delete(key);

            }
            this.state.dashboardData.set(key,value);

        }else{
            if(this.state.dashboardData.has(key)){

                this.state.dashboardData.delete(key);
            }
        }
        //console.log(this.state.dashboardData);
    }

    render() {
        return (
            <div>
                <ResultExcelComponent 
                    results={this.state.results}
                    cadreDict={this.state.cadreDict}
                />
                
                <hr/>
                <div>
                    <Button bsStyle="warning" bsSize="medium" onClick={() => this.props.saveAsFavorite(this.state.dashboardData)}>
                        Add selected to favorite
                    </Button>
                </div>
                <br/>
                <div>
                    {Object.keys(this.state.results).map(id =>
                        <Collapsible trigger={this.state.results[id].facility} key={this.state.results[id].facility}>
                            <div >
                                <h3>Results for {this.state.results[id].facility}</h3>
                                <br />

                                <table className="table-list">
                                    <thead>
                                        <tr>
                                            <th><a href="#">#</a></th>
                                            <th>Cadre</th>
                                            <th>A. Current Workers</th>
                                            <th>B. Workers Needed </th>
                                            <th>Gap(A-B)</th>
                                            <th>Workforce Pressure(A/B)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(this.state.results[id].workersNeeded).map(cadreId =>
                                            <tr>
                                                <td>
                                                    <Checkbox key={cadreId+'checked'} onChange={(e) => this.saveForDashboard(e,
                                                        this.state.results[id].facilityId,//FacilityId
                                                        cadreId,//CadreId
                                                        this.state.results[id].currentWorkers[cadreId],//Current workers
                                                        Number(this.state.results[id].workersNeeded[cadreId]).toFixed(1)//Needed workers
                                            
                                                        )}
                                                    /> 
                                                </td>
                                                <td>
                                                    <h4 key={cadreId + 'cadre'}>{this.state.cadreDict[cadreId]}</h4>
                                                </td>
                                                <td>
                                                    <h4 key={cadreId + 'current'}>{this.state.results[id].currentWorkers[cadreId]}</h4>
                                                </td>
                                                <td>
                                                    <h4 key={cadreId + 'needed'}>{Math.round(this.state.results[id].workersNeeded[cadreId])}</h4>
                                                </td>
                                                <td>
                                                    <h4 
                                                        key={cadreId + 'gap'}
                                                        style={{ color: (this.state.results[id].currentWorkers[cadreId]-Math.round(this.state.results[id].workersNeeded[cadreId])) < 1 ? "red":"green" }}>
                                                        {(this.state.results[id].currentWorkers[cadreId]-Math.round(this.state.results[id].workersNeeded[cadreId]))}
                                                    </h4>
                                                </td>
                                                <td>
                                                    {this.state.results[id].pressure[cadreId] &&
                                                        <h4
                                                            key={cadreId}
                                                            style={{ color: this.state.results[id].pressure[cadreId] < 1 ? "red" : "green" }}>
                                                            {Number(this.state.results[id].pressure[cadreId]).toFixed(2)}x
                                                        </h4>
                                                    }
                                                    {!this.state.results[id].pressure[cadreId] &&
                                                        <h4 key={cadreId} style={{ color: "gray" }}>N/A</h4>
                                                    }
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                <br />

                            </div>
                        </Collapsible>
                    )}
                </div>
            </div>
        )
    }

};