import * as React from 'react';
import Collapsible from 'react-collapsible';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import InlineEdit from 'react-edit-inline2';
import Multiselect from 'react-multiselect-checkboxes';

import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

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
            state: 'form',
            showFilters: false,
            filterText: 'Show filter',
        };

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

        axios.get('/hris/regions').then(res => {
            let regions = res.data;
            this.setState({
                regions: regions,
            });
        }).catch(err => console.log(err));

        axios.get('/hris/districts').then(res => {
            let districts = res.data;
            this.setState({
                districts: districts,
            });
        }).catch(err => console.log(err));

        axios.get('/hris/facilities').then(res => {
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

    importStatistics() {

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
        this.setState({ results: [] }, () => {  //here
            // set state to loading
            this.setState({ state: 'loading' });
            // add timeout so loading animation looks better
            setTimeout(() => {

                let data = {
                    selectedCadre: this.state.selectedCadre,
                    selectedFacility: this.state.selectedFacility,
                    selectedPeriod: this.state.selectedPeriod
                };

                axios.post(`/countrystatistics/generateStatTemplate`, data).then(res => {

                    axios.get('/countrystatistics/statistics').then(res => {
                        this.setState({ statistics: res.data })
                    }).catch(err => console.log(err));

                    this.setState({ state: 'results' });
                })

            }, 1000);
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

            this.setState({ facilities: res.data });
        })
            .catch(err => console.log(err));
    }

    toggleFilters() {
        let showFilters = !this.state.showFilters;

        let filterText = (showFilters) ? 'Hide filter' : 'Show filter';
        this.setState({
            showFilters: showFilters,
            filterText: filterText
        })
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

    importFromDhis2() {
        this.launchToastr("No connexion found to dhis2 server.");
    }

    render() {
        return (
            <Panel bsStyle="primary" header="Import yearly treatments statistics from DHIS2">
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
                                            Facilities ({(this.state.facilities.length)}) [<a href="#" onClick={() => this.toggleFilters()}>{this.state.filterText}</a>]
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

                                {this.state.showFilters &&

                                    <FormGroup>
                                        <hr />
                                        <Col componentClass={ControlLabel} sm={10}>
                                            Region ({(this.state.regions.length)})
                                        </Col>
                                        <Col sm={15}>
                                            <FormControl componentClass="select"
                                                onChange={e => this.loadDistrictsByRegion(e.target.value)}>
                                                <option key="000" value="000">Select value</option>
                                                {(this.state.regions.map(rg =>
                                                    <option key={rg.code} value={rg.code}>{rg.name}</option>
                                                ))}
                                            </FormControl>
                                        </Col>
                                    </FormGroup>
                                }
                                {this.state.showFilters &&
                                    <FormGroup>
                                        <Col componentClass={ControlLabel} sm={10}>
                                            Districts  ({(this.state.districts.length)})
                                        </Col>
                                        <Col sm={15}>
                                            <FormControl componentClass="select"
                                                onChange={e => this.loadFacilitiesByDistrict(e.target.value)}>
                                                <option key="000" value="000">Select value</option>
                                                {(this.state.districts.map(dist =>
                                                    <option key={dist.code} value={dist.code}>{dist.name}</option>
                                                ))}
                                            </FormControl>
                                        </Col>
                                    </FormGroup>
                                }
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
                                <Button bsStyle="warning" bsSize="medium" onClick={() => this.importStatistics()}>Generate template</Button>
                            </div>
                            <br />
                            <div style={{ textAlign: "right", paddingTop: 10 }}>
                                <Button bsStyle="warning" bsSize="medium" onClick={() => this.importFromDhis2()}>Import service data from DHIS2</Button>
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
            </Panel>
        );

    }
};