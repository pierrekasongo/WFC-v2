import * as React from 'react';
import Collapsible from 'react-collapsible';
import { Button, Table, FormGroup,Checkbox } from 'react-bootstrap';
import {FaChartBar} from 'recharts';

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
    launchToastr(msg) {
        toastr.options = {
            positionClass: 'toast-top-full-width',
            hideDuration: 15,
            timeOut: 6000
        }
        toastr.clear()
        setTimeout(() => toastr.error(msg), 300)
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
        console.log(this.state.dashboardData);
    }

    saveAsFavorite(){

        let data = {};

        let count=0;

        if(this.state.dashboardData.size > 0){

            for (var [key, value] of map) {

                let fa_cadre = key.split('-');

                let values = value.split('|');

                data[count] = {

                    facilityId: fa_cadre[0],
                    cadreId: fa_cadre[1],
                    currentWorkers: values[0],
                    neededWorkers: values[1],
                }
                count++;
            }
            
            let datas = {
                selectedData:data
            }
            axios.post(`/dashboard/save_as_favorite`,datas,{
                headers :{
                    Authorization : 'Bearer '+localStorage.getItem('token')
                }
            }).then(res => {
                this.launchToastr('Record successfully added to dashboard.');
            }).catch(err => console.log(err));
        }else{
            this.launchToastr('No data selected. Please check the record you want to save.');
        }
    }
    render() {
        return (
            <div>
                {/*
                <ResultCsvComponent
                    results={this.state.results}
                    cadreDict={this.state.cadreDict}
                />*/}
                <ResultExcelComponent 
                    results={this.state.results}
                    cadreDict={this.state.cadreDict}
                />
                {/*<div>
                    <Button bsStyle="warning" bsSize="medium" onClick={() => this.props.saveAsFavorite()}>
                        <FaChartBar /> Add selected to favorite
                    </Button>
                </div>*/}
                {Object.keys(this.state.results).map(id =>
                    <Collapsible trigger={this.state.results[id].facility}>
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
        )
    }

};