import * as React from 'react';

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

            let gap="0";

            Object.keys(results[id].workersNeeded).map(cadreId =>{

                cadre=this.state.cadreDict[cadreId];
                curr_workers=(results[id].currentWorkers[cadreId])?results[id].currentWorkers[cadreId].toString():'0';
                needed_workers=(results[id].workersNeeded[cadreId])?results[id].workersNeeded[cadreId].toFixed(0).toString():'0';
                pressure=(results[id].pressure[cadreId])?Number(results[id].pressure[cadreId]).toFixed(0).toString():'0';
                gap=(results[id].currentWorkers[cadreId]-results[id].workersNeeded[cadreId]).toFixed(0).toString();
                facility=results[id].facility.toString();

                printable.push({
                    facility:facility,
                    cadre:cadre,
                    currentWorkers:curr_workers,
                    workersNeeded:needed_workers,
                    gap:gap,
                    pressure:pressure
                });
            });
            //facility=this.state.results[id].facility; 
        });
        return printable;
    }

    clicked(){
        this.csvLink.current.link.click();
    }

    render() {
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
                    target="_blank" /> 
            </div>           
        );
    }
}