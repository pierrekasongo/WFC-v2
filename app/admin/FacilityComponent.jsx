import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import { FaCheck, FaTrash,FaCloudUploadAlt,FaFileExcel } from 'react-icons/fa';
import toastr from 'toastr';
import { confirmAlert } from 'react-confirm-alert';
import 'toastr/build/toastr.min.css';

import * as FileSaver from 'file-saver';

import * as XLSX from 'xlsx';

export default class FacilityComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            facilities: [],
            state: 'done',
            bulkFacilities: {},
            facilitiesCombo: [],
            selectedFacilities: [],
            facilitiesMap: new Map(),
            showButtons:false,
        };
      
        this.handleUploadFacility = this.handleUploadFacility.bind(this);
        this.selectMultipleFacilities = this.selectMultipleFacilities.bind(this);
        this.deleteFacility = this.deleteFacility.bind(this);
        this.insertFacilities = this.insertFacilities.bind(this);

        axios.get(`/facility/facilities/${localStorage.getItem('countryId')}`,{
            headers :{
                Authorization : 'Bearer '+localStorage.getItem('token')
            }
        }).then(res => {

            let facilitiesMap = new Map();

            res.data.forEach(dt => {
                facilitiesMap.set(dt.code, dt.name);
            })
            this.setState({
                facilities: res.data,
                facilitiesMap: facilitiesMap
            });
        }).catch(err => console.log(err));

        console.log(this.state.facilities);
    }

    deleteFacility(id) {

        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-ui'>
                        <h3>Confirmation</h3>
                        <p>Are you sure you want to delete this facility?</p>
                        <button onClick={onClose}>No</button> &nbsp;&nbsp;
                        <button
                            onClick={() => {

                                this.setState({ state: 'loading' });

                                axios.delete(`/facility/deleteFacility/${id}`)
                                    .then((res) => {

                                        axios.get(`/facility/facilities/${localStorage.getItem('countryId')}`,{
                                            headers :{
                                                Authorization : 'Bearer '+localStorage.getItem('token')
                                            }
                                        }).then(res => {

                                            let facilitiesMap = new Map();

                                            res.data.forEach(dt => {
                                                facilitiesMap.set(dt.code, dt.name);
                                            })
                                            this.setState({
                                                facilities: res.data,
                                                facilitiesMap: facilitiesMap
                                            });
                                        }).catch(err => console.log(err));

                                        this.setState({ state: 'done' });

                                    }).catch(err => {
                                        console.log(err);
                                    });
                                onClose();
                            }}>
                            Yes
                        </button>
                    </div>
                );
            }
        });
    }
    insertFacilities() {

        let data = {
            selectedFacilities: this.state.selectedFacilities
        };

        this.setState({ state: 'loading' });

        axios.post(`/facility/insert_facilities`, data).then(res => {

            axios.get('/facility/facilities').then(res => {

                let facilitiesMap = new Map();

                res.data.forEach(dt => {
                    facilitiesMap.set(dt.code, dt.name);
                })
                this.setState({
                    facilities: res.data,
                    facilitiesMap: facilitiesMap
                });
                this.setState({ state: 'done' });

            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }
    selectMultipleFacilities(values) {

        let selectedFacilities = [];

        this.setState({showButtons:(values.length > 0)});

        values.forEach(val => {
            let names = val.label.split("/");
            let region = names[0];
            let district = names[1];
            let facility = names[2];
            let id = val.value;
            
            if (this.state.facilitiesMap.has(id)) {
                this.launchToastr("This facility has been added already","SUCCESS");
                return;
            } else {
                selectedFacilities.push({
                    id: id,
                    name: facility,
                    region: region,
                    district: district,
                });
            }
        })
        this.setState({ selectedFacilities: selectedFacilities });
    }

    launchToastr(msg,type="ERROR") {
        toastr.options = {
            positionClass: 'toast-top-full-width',
            hideDuration: 15,
            timeOut: 6000
        }
        toastr.clear()
        if(type == 'ERROR')
            setTimeout(() => toastr.error(msg), 300)
        else
            setTimeout(() => toastr.success(msg),300)
    }

    handleUploadFacility(ev) {

        ev.preventDefault();

        const data = new FormData();

        if (this.uploadFacilityInput.files.length == 0) {
            this.launchToastr("No file selected");
            return;
        }

        data.append('file', this.uploadFacilityInput.files[0]);

        axios.post('/facility/uploadFacilities', data,
            {
                onUploadProgress: progressEvent => {
                    var prog = (progressEvent.loaded / progressEvent.total) * 100;
                    var pg = (prog < 100) ? prog.toFixed(2) : prog.toFixed(0);
                    this.setState({ progress: pg });
                    //console.log(pg+"%");
                }
            })
            .then((result) => {
                this.setState({ progress: result.data });
                axios.get(`/facility/facilities/${localStorage.getItem('countryId')}`,{
                    headers :{
                        Authorization : 'Bearer '+localStorage.getItem('token')
                    }
                }).then(res => {

                    let facilitiesMap = new Map();
        
                    res.data.forEach(dt => {
                        facilitiesMap.set(dt.code, dt.name);
                    })
                    this.setState({
                        facilities: res.data,
                        facilitiesMap: facilitiesMap
                    });
                }).catch(err => console.log(err));

            }).catch(err => {
                if (err.response.status === 401) {
                    this.props.history.push(`/login`);
                } else {
                    console.log(err);
                }
            });
    }
    createTemplate(facilities){

        const template = [];

        facilities.forEach(fa => {

            template.push({"Region":fa.region,"District":fa.district,"Facility type code":fa.facilityTypeCode,
            "Facility type name":fa.facilityType, "Facility code":fa.code,"Facility name":fa.name});
        });

        return template;
    }
  
    async generateTemplate(facilities){

        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        const fileName = 'facilities';

        const template = await this.createTemplate(facilities);

        
        const wb = XLSX.utils.book_new();

        const ws_template = XLSX.utils.json_to_sheet(template);
        XLSX.utils.book_append_sheet(wb,ws_template,"FACILITIES");
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }


    render() {
        return (
            <div className="tab-main-container">
                
                <Form horizontal>
                    <div className="cadres-container">
                        <div>
                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={20}>
                                    <div className="div-title">
                                        <b>Available facilities</b>
                                    </div>
                                    <hr />
                                </Col>
                            </FormGroup>
                           
                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={10}>
                                    <div>
                                        <button className="button" onClick={() => this.generateTemplate(this.state.facilities)}>
                                        <FaFileExcel /> Download</button>
                                    </div> 
                                </Col>
                            </FormGroup>
                            <br/>
                            {this.state.state == 'loading' &&
                                <div style={{ marginTop: 120, marginBottom: 65 }}>
                                    <div className="loader"></div>
                                </div>
                            }
                            {
                                this.state.showingNew &&
                                <NewFacilityComponent
                                    facilities={this.state.facilities}
                                    facilityType={this.state.facilityType}
                                    save={info => this.newFacilitySave(info)}
                                    cancel={() => this.setState({ showingNew: false })} />
                            }
                            {this.state.state == 'done' &&
                                <table className="table-list" cellSpacing="10">
                                    <thead>
                                        <th>Region</th>
                                        <th>District</th>
                                        <th>Facility</th>
                                        <th>Facility type</th>
                                        <th></th>
                                    </thead>
                                    <tbody>
                                        {this.state.facilities.map(fac =>
                                            <tr key={fac.id}>
                                                <td>{fac.region}</td>
                                                <td>{fac.district}</td>
                                                <td>{fac.name}</td>
                                                <td>{fac.facilityType}</td>
                                                <td>
                                                    <a href="#" onClick={() => this.deleteFacility(fac.id)}>
                                                        <FaTrash />
                                                    </a>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            }
                        </div>
                    </div>
                </Form>
            </div>
        );
    }
};