import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import { FaCheck, FaTrash } from 'react-icons/fa';
import toastr from 'toastr';
import { confirmAlert } from 'react-confirm-alert';
import 'toastr/build/toastr.min.css';
import Multiselect from 'react-multiselect-checkboxes';

export default class FacilityPanel extends React.Component {

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
        this.selectMultipleFacilities = this.selectMultipleFacilities.bind(this);
        this.deleteFacility = this.deleteFacility.bind(this);
        this.insertFacilities = this.insertFacilities.bind(this);

        axios.get('/dhis2/facilities').then(res => {

            let facilitiesMap = new Map();

            res.data.forEach(dt => {
                facilitiesMap.set(dt.code, dt.name);
            })
            this.setState({
                facilities: res.data,
                facilitiesMap: facilitiesMap
            });
        }).catch(err => console.log(err));

        axios.get('/dhis2/import_facilities_from_dhis2').then(res => {

            let bulkFacilities = {};

            res.data.forEach(bf => {

                bulkFacilities[bf.id] = {
                    id: bf.id,
                    level: bf.level,
                    name: bf.name,
                    parent: bf.parent
                }
            });
            this.setState({ bulkFacilities: bulkFacilities });

            let facilitiesCombo = [];

            res.data.forEach(fa => {

                let facility = "";

                if (bulkFacilities[fa.id].parent) {
                    facility = bulkFacilities[fa.parent.id].name + '/' + fa.name;
                } else {
                    facility = fa.name;
                }
                facilitiesCombo.push({ label: facility, value: fa.id });
            });
            this.setState({ facilitiesCombo: facilitiesCombo });

        }).catch(err => console.log(err));
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

                                axios.delete(`/dhis2/deleteFacility/${id}`)
                                    .then((res) => {

                                        axios.get('/dhis2/facilities').then(res => {

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

        axios.post(`/dhis2/insert_facilities`, data).then(res => {

            axios.get('/dhis2/facilities').then(res => {

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
            let parent = names[0];
            let facility = names[1];
            let id = val.value;
            if (this.state.facilitiesMap.has(id)) {
                this.launchToastr("This facility has been added already");
                return;
            } else {
                selectedFacilities.push({
                    id: id,
                    name: facility,
                    parent: parent,
                });
            }
        })
        this.setState({ selectedFacilities: selectedFacilities });
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

    render() {
        return (
            <div className="tab-main-container">
                <Form horizontal>
                    <div className="cadres-container">

                        <div>
                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={20}>
                                    <div className="div-title">
                                        <b>Import facilities from DHIS2</b>
                                    </div>
                                    <hr />
                                </Col>
                            </FormGroup>
                            <div class="alert alert-warning" role="alert">
                                Select facilities from below dropbox and click the button to import.
                            </div>
                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={10}>
                                    Choose from DHIS2 ({this.state.facilitiesCombo.length})
                                </Col>
                                <table className="tbl-multiselect">
                                    <tr>
                                        <td>
                                            <div className="div-multiselect">
                                                <Multiselect
                                                    options={this.state.facilitiesCombo}
                                                    onChange={this.selectMultipleFacilities} />
                                            </div>

                                        </td>
                                        {this.state.showButtons &&
                                            <td>
                                                <button className="button" onClick={() => this.insertFacilities()}><FaCheck /> Import</button>
                                            </td>
                                        }
                                    </tr>
                                </table>
                                <hr />
                            </FormGroup>

                            {this.state.state == 'loading' &&
                                <div style={{ marginTop: 120, marginBottom: 65 }}>
                                    <div className="loader"></div>
                                </div>
                            }
                            {this.state.state == 'done' &&
                                <table className="table-list" cellSpacing="10">
                                    <thead>
                                        <th>Parent</th>
                                        <th>Facility</th>
                                        <th></th>
                                    </thead>
                                    <tbody>
                                        {this.state.facilities.map(fac =>
                                            <tr key={fac.id}>
                                                <td>{fac.parentName}</td>
                                                <td>{fac.name}</td>
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