import * as React from 'react';
import Collapsible from 'react-collapsible';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import InlineEdit from 'react-edit-inline2';
import Multiselect from 'react-multiselect-checkboxes';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

import HRUploadPanel from '../import/HRUploadPanel';

export default class StatisticsPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            results: [],
            cadres: [],
            facilities: [],
            years: [],//Save years to db
            regions: [],
            districts: [],
            selectedPeriod: "",
            selectedFacility: "",
            selectedCadre: "",
            filteredFacility: "",
            filteredCadre: "",
            statistics: [],
            filteredStats: [],
            state: 'done',
        };
        this.importStatisticsFromDhis2 = this.importStatisticsFromDhis2.bind(this);
        axios.get('/countrystatistics/statistics').then(res => {
            this.setState({
                statistics: res.data,
                filteredStats: res.data
            })
        }).catch(err => console.log(err));

        axios.get('/configuration/getYears').then(res => {
            let years = res.data;
            this.setState({
                years: years
            })
        }).catch(err => console.log(err));

        axios.get('/hris/cadres').then(res => {
            this.setState({ cadres: res.data });
        }).catch(err => console.log(err));

        axios.get('/dhis2/facilities').then(res => {
            this.setState({ facilities: res.data });
        })
            .catch(err => console.log(err));

    }

    handlePatientsChange(obj) {

        const ident = Object.keys(obj)[0].split("-");

        const id = ident[0];

        const param = ident[1];

        const value = Object.values(obj)[0];

        let data = {
            id: id,
            param: param,
            value: value,
        };
        axios.patch('/countrystatistics/editPatientsCount', data).then(res => {

            axios.get('/countrystatistics/statistics').then(res => {
                this.setState({
                    statistics: res.data,
                    filteredStats: res.data
                })

            }).catch(err => console.log(err));
        }).catch(err => {

        });
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

    filterStatByFacility(facility) {

        let stats = this.state.statistics;

        this.setState({ filteredStats: stats.filter(st => st.facility.toLowerCase().includes(facility.toLowerCase())) })
        //let cadre = st.cadre.toUpperCase();
        //item => item.name.includes(this.state.input)
        //let filter = this.state.filteredCadre.toUpperCase();
        // return this.state.statistics.indexOf(filter) > -1;
    }
    filterStatByCadre(cadreCode) {

        let stats = this.state.filteredStats;

        if (cadreCode !== "000") {

            this.setState({
                filteredStats: stats.filter(st => st.cadre_code.includes(cadreCode))
            })
        }
    }

    importStatisticsFromDhis2() {

        if (this.state.selectedPeriod.length == 0) {
            this.launchToastr("Please, select a year first before calculating.");
            return;
        }
        if (typeof (this.state.selectedFacility) == 'undefined') {
            this.launchToastr("No facility selected.");
            return;
        }
        if (typeof (this.state.selectedCadre) == 'undefined') {
            this.launchToastr("No cadre selected.");
            return;
        }

        let data = {
            selectedPeriod: this.state.selectedPeriod,
            selectedFacilities: this.state.selectedFacility,
            selectedCadres: this.state.selectedCadre
        };

        this.setState({ state: 'loading' });

        axios.post(`/dhis2/import_statistics`, data).then(res => {
            //Code goes here
            this.setState({ state: 'done' });
        }).catch(err => console.log(err));

    }

    render() {
        return (
            <Panel bsStyle="primary" header="Import yearly treatments statistics from DHIS2">
                <Tabs>
                    <TabList>
                        <Tab>Treatments statistics</Tab>
                        <Tab>Workforce statistics</Tab>
                    </TabList>
                    <TabPanel>
                        <div className="calc-container">
                            <div className="calc-container-left">
                                <Form horizontal>
                                    <div className="div-title">
                                        <b>Set import values</b>
                                    </div>
                                    <FormGroup>
                                        <Col componentClass={ControlLabel} sm={10}>
                                            Year
                                </Col>

                                        <Col sm={15}>
                                            <FormControl componentClass="select"
                                                onChange={e => this.setState({ selectedPeriod: e.target.value })}>
                                                <option key="000" value="000">Select year </option>
                                                {(this.state.years.map(yr =>
                                                    <option key={yr.id} value={yr.year}>{yr.year}</option>
                                                ))}
                                            </FormControl>
                                        </Col>
                                    </FormGroup>

                                    <FormGroup>
                                        <Col sm={15}>
                                            <FormGroup>
                                                <Col componentClass={ControlLabel} sm={10}>
                                                    Facilities ({(this.state.facilities.length)})
                                        </Col>
                                                <Col sm={15}>
                                                    <FormControl componentClass="select"
                                                        onChange={e => this.setState({ selectedFacility: e.target.value })}>
                                                        <option key="000" value="000">Select value</option>
                                                        {(this.state.facilities.map(fa =>
                                                            <option key={fa.code} value={fa.code}>{fa.name}</option>
                                                        ))}
                                                    </FormControl>
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                    </FormGroup>

                                    <FormGroup>
                                        <Col sm={15}>
                                            <FormGroup>
                                                <Col componentClass={ControlLabel} sm={10}>
                                                    Cadres ({(this.state.cadres.length)})
                                        </Col>
                                                <Col sm={15}>
                                                    <FormControl componentClass="select"
                                                        onChange={e => this.setState({ selectedCadre: e.target.value })}>
                                                        <option key="000" value="000">Select value</option>
                                                        {(this.state.cadres.map(cd =>
                                                            <option key={cd.code} value={cd.code}>{cd.name}</option>
                                                        ))}
                                                    </FormControl>
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                    </FormGroup>
                                    <hr />
                                    <div style={{ textAlign: "right", paddingTop: 10 }}>
                                        <Button bsStyle="warning" bsSize="medium" onClick={this.importStatisticsFromDhis2}>Import statisticsfrom DHIS2</Button>
                                    </div>
                                </Form>
                            </div>
                            <div className="calc-container-right">
                                <FormGroup>
                                    <Col componentClass={ControlLabel} sm={20}>
                                        <div className="div-title">
                                            <b>Annual treatment statistics</b>({this.state.filteredStats.length})
                                </div>
                                    </Col>
                                    <div className="filter-container">
                                        <div>
                                            <FormGroup>
                                                <Col sm={15}>
                                                    <FormControl componentClass="select"
                                                        onChange={e => this.filterStatByCadre(e.target.value)}>
                                                        <option key="000" value="000">Filter by cadre</option>
                                                        {(this.state.cadres.map(cd =>
                                                            <option key={cd.code} value={cd.code}>{cd.name}</option>
                                                        ))}
                                                    </FormControl>
                                                </Col>
                                            </FormGroup>
                                        </div>

                                        <div>
                                            <FormGroup>
                                                <Col sm={15}>
                                                    <input typye="text" className="form-control"
                                                        placeholder="Filter by facility" onChange={e => this.filterStatByFacility(e.target.value)} />
                                                </Col>
                                            </FormGroup>
                                        </div>
                                    </div>
                                </FormGroup>
                                <hr />
                                {this.state.state == 'loading' &&
                                    <div style={{ marginTop: 120, marginBottom: 65 }}>
                                        <div className="loader"></div>
                                    </div>
                                }
                                <table className="table-list">
                                    <thead>
                                        <tr>
                                            <th>Facility</th>
                                            <th>Cadre</th>
                                            <th>Treatment</th>
                                            <th># patients</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.filteredStats.map(st =>
                                            <tr key={st.id}>
                                                <td>{st.facility}</td>
                                                <td>{st.cadre}</td>
                                                <td>{st.treatment}</td>
                                                {/*<td>{tr.patients}</td>*/}
                                                <td>
                                                    <div>
                                                        <a href="#">
                                                            <InlineEdit
                                                                validate={this.validateTextValue}
                                                                activeClassName="editing"
                                                                text={`` + st.patients}
                                                                paramName={st.id + '-caseCount'}
                                                                change={this.handlePatientsChange}
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
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <br />
                        </div>
                        <br />
                    </TabPanel>

                    <TabPanel>
                        <HRUploadPanel />
                    </TabPanel>
                </Tabs>
            </Panel>
        );

    }
};