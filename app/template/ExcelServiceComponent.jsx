import * as React from 'react';

import * as FileSaver from 'file-saver';

import {FaFileExcel} from 'react-icons/fa';

import * as XLSX from 'xlsx';

export default class ExcelServiceComponent extends React.Component {

    constructor(props) {

        super(props);
        this.state ={
            data:[]
        }
    }

    createTemplate(facilities, cadres, treatments,year){

        const template = [];

        facilities.forEach(fa => {

            var faCode = fa.code;
            var region = fa.region;
            var district = fa.district;
            var faName = fa.name;

            cadres.forEach(cd =>{

                var cdName = cd.name;

                var cdCode = cd.code;

                var filteredTreatments = treatments.filter(t => t.cadre_code == cdCode);

                filteredTreatments.forEach(tr => {
                    var trCode = tr.code;
                    var trName = tr.name;
                    var trType = tr.treatment_type;
                    
                    template.push({"Region":region,"District":district,
                        "Facility code":faCode, "Facility name":faName,"Cadre code":cdCode,
                        "Cadre name":cdName,"Activity code":trCode,"Activity name":trName,"Year":year,"Patients count":""});
                })

            })
        });

        return template;
    }
  
    async generateTemplate(facilities, cadres,treatments,year){

        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const fileName = 'Activity_Template';

        const template = await this.createTemplate(facilities,cadres,treatments,year);

        
        const wb = XLSX.utils.book_new();

        const ws_template = XLSX.utils.json_to_sheet(template);
    
        XLSX.utils.book_append_sheet(wb,ws_template,"TEMPLATE");
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }
    render() {
        return (
            <div>
                <span>
                    <button className="button" onClick={() => this.generateTemplate(this.props.facilities,
                        this.props.cadres,this.props.treatments,this.props.year)}>
                    <FaFileExcel /> Download template</button>
                </span>
            </div>         
        );
    }
}