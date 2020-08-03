import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import InlineEdit from 'react-edit-inline2';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import { FaTrash, FaCloudUploadAlt, FaCheck, FaFileCsv, FaFolderOpen } from 'react-icons/fa';
//import TreeView from 'react-pretty-treeview';

export default class HRUploadPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            progress: '',
            staffs: [],
            regions: [],
            districts: [],
            facilities: [],
            cadres: [],
            staffToDelete: ''
        };

        this.handleUploadHR = this.handleUploadHR.bind(this);

        axios.get(`/staff/workforce/${localStorage.getItem('countryId')}`,{
            headers :{
                Authorization : 'Bearer '+localStorage.getItem('token')
            }
        }).then(res => {
            this.setState({ staffs: res.data });
        }).catch(err => console.log(err));

        axios.get(`/cadre/cadres/${localStorage.getItem('countryId')}`,{
            headers :{
                Authorization : 'Bearer '+localStorage.getItem('token')
            }
        }).then(res => {

            this.setState({ cadres: res.data });

        }).catch(err => console.log(err));
    }

    filterWorkforce(cadreCode) {

        if (cadreCode == "0") {
            axios.get(`/staff/workforce/${localStorage.getItem('countryId')}`,{
                headers :{
                    Authorization : 'Bearer '+localStorage.getItem('token')
                }
            }).then(res => {
                this.setState({ staffs: res.data });
            }).catch(err => console.log(err));
        } else {
            axios.get(`/staff/workforce/${cadreCode}`).then(res => {
                this.setState({ staffs: res.data });
            }).catch(err => {
                console.log(err);
                if (err.response.status === 401) {
                    this.props.history.push(`/login`);
                } else {
                    console.log(err);
                }
            });
        }

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

    handleUploadHR(ev) {

        ev.preventDefault();

        const data = new FormData();

        data.append('file', this.uploadHRInput.files[0]);

        if (this.uploadHRInput.files.length == 0) {
            this.launchToastr("No file selected. Please select a valid file before validating.");
            return;
        }

        axios.post('/staff/uploadHR', data,
            {
                onUploadProgress: progressEvent => {
                    var prog = (progressEvent.loaded / progressEvent.total) * 100;
                    var pg = (prog < 100) ? prog.toFixed(2) : prog.toFixed(0);
                    this.setState({ progress: pg });
                }
            })
            .then((result) => {
                this.setState({ progress: result.data });
                axios.get('/staff/workforce').then(res => {
                    this.setState({ staffs: res.data });
                }).catch(err => console.log(err));

            }).catch(err => {
                if (err.response.status === 401) {
                    this.props.history.push(`/login`);
                } else {
                    console.log(err);
                }
            });
    }

    loadDistrictsByRegion(regionCode) {

        let url = (regionCode == "000") ? '/hris/districts' : '/hris/districtsByRegion/' + regionCode;

        axios.get(url).then(res => {
            let districts = res.data;
            this.setState({
                districts: districts,
            });
        }).catch(err => console.log(err));
    }

    loadFacilitiesByDistrict(districtCode) {

        let url = (districtCode == "000") ? '/hris/facilities' : '/hris/facilitiesByDistrict/' + districtCode;

        axios.get(url).then(res => {

            let facilities = res.data;

            let facilityInputs = {};
            let facilityDict = {};

            let facilitiesCombo = [];

            facilities.forEach(fa => {
                facilityInputs[fa.id] = {
                    name: fa.name,
                    code: fa.code
                }
                facilityDict[fa.id] = fa.name;

                let id = fa.id + '|' + fa.code;

                facilitiesCombo.push({ label: fa.name, value: id });
            });

            this.setState({
                facilities: facilities,
                facilityDict: facilityDict,
                facilityInputs: facilityInputs,
                facilitiesCombo: facilitiesCombo
            });
        })
            .catch(err => console.log(err));
    }

    handleStaffChange(obj) {

        const ident = Object.keys(obj)[0].split("-");

        const id = ident[0];

        const param = ident[1];

        const value = Object.values(obj)[0];

        let data = {
            id: id,
            param: param,
            value: value,
        };
        axios.patch('/staff/editHR', data).then(res => {
            axios.get(`/staff/workforce/${localStorage.getItem('countryId')}`,{
                headers :{
                    Authorization : 'Bearer '+localStorage.getItem('token')
                }
            }).then(res => {
                this.setState({ staffs: res.data });
            }).catch(err => console.log(err));
        }).catch(err => {
            if (err.response.status === 401) {
                this.props.history.push(`/login`);
            } else {
                console.log(err);
            }
        });
    }

    deleteStaff(id) {

        this.setState({
            staffToDelete: id
        });
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className='custom-ui'>
                        <h3>Confirmation</h3>
                        <p>Are you sure you want to delete this record?</p>
                        <button onClick={onClose}>No</button> &nbsp;&nbsp;
                        <button
                            onClick={() => {
                                axios.delete(`/hris/deleteWorkforce/${this.state.staffToDelete}`)
                                    .then((res) => {
                                        axios.get(`/staff/workforce/${localStorage.getItem('userId')}`,{
                                            headers :{
                                                Authorization : 'Bearer '+localStorage.getItem('token')
                                            }
                                        }).then(res => {
                                            this.setState({ staffs: res.data });
                                        }).catch(err => console.log(err));

                                    }).catch(err => {
                                        if (err.response.status === 401) {
                                            this.props.history.push(`/login`);
                                        } else {
                                            console.log(err);
                                        }
                                    });
                                onClose();
                            }}>
                            Yes, Delete it!
                        </button>
                    </div>
                );
            }
        });
    }

    render() {
        return (
            <div className="tab-main-container">
                <Form horizontal>
                    <div>
                        <div className="cadres-container">
                            <div className="div-flex-table-left">
                                <FormGroup>
                                    <Col componentClass={ControlLabel} sm={20}>
                                        <div className="div-title">
                                            <b>Uploading workforce data</b>
                                        </div>
                                        <hr />
                                        <FormGroup>
                                            <Col componentClass={ControlLabel} sm={20}>

                                                <div class="alert alert-warning" role="alert">
                                                    <p>Make sure it's a csv file with following headers and order.</p>
                                                    <p><b>"Region","District","Facility type","Facility code","Facility name","Cadre code", "Cadre name", "Staff count"</b></p>
                                                </div>

                                                <form onSubmit={this.handleUploadHR}>
                                                    <div class="upload-btn-wrapper">
                                                        <button class="btn"><FaFolderOpen /> Choose file...</button>
                                                        <input ref={(ref) => { this.uploadHRInput = ref; }} type="file" />
                                                    </div>
                                                    <br />
                                                    <br />
                                                    <div>
                                                        <span>
                                                            <button className="button"><FaCloudUploadAlt /> Upload file</button><span> {this.state.progress}</span>
                                                        </span>
                                                    </div>
                                                </form>
                                            </Col>
                                        </FormGroup>
                                    </Col>
                                </FormGroup>
                                <hr />
                            </div>
                            <br/><br/>

                            <div className="div-flex-table-right">
                                <FormGroup>
                                    <div className="div-title">
                                        <b>Workforce</b>
                                    </div>
                                    <hr />
                                    <Col sm={10}>
                                        <FormControl
                                            componentClass="select"
                                            onChange={e => this.filterWorkforce(e.target.value)}>
                                            <option value="0" key="000">Filter by cadre</option>
                                            {this.state.cadres.map(cadre =>
                                                <option
                                                    key={cadre.std_code}
                                                    value={cadre.std_code}>
                                                    {cadre.name_fr + '/' + cadre.name_en}
                                                </option>
                                            )}
                                        </FormControl>
                                    </Col>
                                </FormGroup>
                                <hr />
                                <table className="table-list">
                                    <thead>
                                        <tr>
                                            <th>Facility</th>
                                            <th>Cadre</th>
                                            <th align="center"># staff</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.staffs.map(st =>
                                            <tr key={st.id} >
                                                <td>
                                                    {st.facility}
                                                </td>
                                                <td>
                                                    {st.cadre}
                                                </td>
                                                <td align="center">
                                                    <div>
                                                        <a href="#">
                                                            <InlineEdit
                                                                validate={this.validateTextValue}
                                                                activeClassName="editing"
                                                                text={`` + st.staff}
                                                                paramName={st.id + '-staffCount'}
                                                                change={this.handleStaffChange}
                                                                style={{
                                                                    minWidth: 150,
                                                                    display: 'inline-block',
                                                                    margin: 0,
                                                                    padding: 0,
                                                                    fontSize: 11,
                                                                    outline: 0,
                                                                    border: 0
                                                                }}
                                                            />
                                                        </a>
                                                    </div>
                                                </td>
                                                <td>
                                                    <a href="#" onClick={() => this.deleteStaff(`${st.id}`)}>
                                                        <FaTrash />
                                                    </a>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                <br /><br />
                            </div>
                        </div>
                    </div>
                </Form>
            </div>
        )
    }
};