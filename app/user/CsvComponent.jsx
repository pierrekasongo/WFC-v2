import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Checkbox, Table } from 'react-bootstrap';

import { CSVLink, CSVDownload } from "react-csv";

export default class CsvComponent extends React.Component {
    constructor(props) {

        super(props);

        this.state = {
            cadreDict:props.cadreDict,
            results:props.results,
        }
        this.csvLink=React.createRef();

        this.state={
            data:this.fetchData(props.results)
        }
    }

    fetchData(results){

        let printable=[];

        Object.keys(this.state.results).map(id => {

            let facility="";
            
            let cadre="";

            let curr_workers="";

            let needed_workers="";

            let pressure="";

            Object.keys(results[id].workersNeeded).map(cadreId =>{

                cadre=this.state.cadreDict[cadreId];
                curr_workers=(results[id].currentWorkers[cadreId])?results[id].currentWorkers[cadreId].toString():'0';
                needed_workers=(results[id].workersNeeded[cadreId])?results[id].workersNeeded[cadreId].toString():'0';
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
            //facility=this.state.results[id].facility; 
        });

        //console.log(printable);

        return printable;
        //this.state.data=printable;
        
        //this.csvLink.current.link.click();
    }

    clicked(){
        this.csvLink.current.link.click();
    }

    render() {
        //console.log(this.state.data);
        return (
            <div>
                {/*<button onClick={() => this.fetchData(this.props.results)}>Download to csv</button>*/}
                <a href="#" onClick={() => this.clicked()}>Download to csv</a>
                <br/>
                <CSVLink 
                    data={this.state.data} 
                    filename="pressure_calculation.csv"
                    className="hidden"
                    ref={this.csvLink}
                    target="_blank"
                /> 
            </div>           
        );
    }
}