import * as React from 'react';

import * as FileSaver from 'file-saver';

import {FaFileExcel} from 'react-icons/fa';

import * as XLSX from 'xlsx';

export default class ExcelHRComponent extends React.Component {

    constructor(props) {

        super(props);
        this.state ={
            data:[]
        }
    }

    createTemplate(facilities, cadres){

        const template = [];

        facilities.forEach(fa => {

            var faCode = fa.code;
            var region = fa.region;
            var district = fa.district;
            var faType = fa.facilityType;
            var faName = fa.name;

            cadres.forEach(cd =>{
                var cdName = cd.name;
                var cdCode = cd.code;

                template.push({"Region":region,"District":district,"Facility type":faType,
                "Facility code":faCode, "Facility name":faName,"Cadre code":cdCode,"Cadre name":cdName,"Staff count":""});
            })
        });

        return template;
    }
  
    async generateTemplate(facilities, cadres){

        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const fileName = 'HR_Template';

        const template = await this.createTemplate(facilities,cadres);

        
        const wb = XLSX.utils.book_new();

        const ws_template = XLSX.utils.json_to_sheet(template);
        //const ws_facilities = XLSX.utils.json_to_sheet(facilities);
        //const ws_cadres = XLSX.utils.json_to_sheet(cadres);

        XLSX.utils.book_append_sheet(wb,ws_template,"TEMPLATE");
       // XLSX.utils.book_append_sheet(wb,ws_facilities,"FACITILITIES");
        //XLSX.utils.book_append_sheet(wb,ws_cadres,"CADRES");
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }
    render() {
        return (
            <div>
                <span>
                    <button className="button" onClick={() => this.generateTemplate(this.props.facilities,this.props.cadres)}>
                    <FaFileExcel /> Download template</button>
                </span>
            </div>         
        );
    }
}