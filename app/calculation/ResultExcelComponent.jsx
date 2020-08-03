import * as React from 'react';

import { CSVLink, CSVDownload } from "react-csv";

import {FaFileExcel } from 'react-icons/fa';

import * as FileSaver from 'file-saver';

import * as XLSX from 'xlsx';

export default class ResultExcelComponent extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            cadreDict:props.cadreDict,
            results:props.results,
        }

    }

    createTemplate(results){

        let printable=[];

        Object.keys(results).map(id => {
            
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
        });
        return printable;
    }
  
    async generateTemplate(results){

        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const fileName = 'results';

        const template = await this.createTemplate(results);

        
        const wb = XLSX.utils.book_new();

        const ws_template = XLSX.utils.json_to_sheet(template);
        XLSX.utils.book_append_sheet(wb,ws_template,"RESULTS");
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }
    render() {
        return (
            <div>
                <button className="button" onClick={() => this.generateTemplate(this.props.results)}>
                    <FaFileExcel /> Download</button>
            </div>    
        );
    }
}