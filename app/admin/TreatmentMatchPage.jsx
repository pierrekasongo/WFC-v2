import * as React from 'react';
import Collapsible from 'react-collapsible';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import InlineEdit from 'react-edit-inline2';
import Multiselect from 'react-multiselect-checkboxes';
import { Draggable, Droppable } from 'react-drag-and-drop';

import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

export default class TreatmentMatchPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

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
    }
    onDrop(data) {
        console.log(data)
        // => banana 
    }

    render() {
        return (
            <Panel bsStyle="primary" header="Import yearly treatments statistics from DHIS2">
                <div className="filter-container">
                    {/*<div>
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
                    </div>*/}
                </div>
                <div className="calc-container">
                    <div className="calc-container-left">
                        <Col componentClass={ControlLabel} sm={20}>
                            <div className="div-title">
                                <b>Source</b>
                            </div>
                        </Col>
                        <div>
                            <ul>
                                <Draggable type="fruit" data="banana"><li>Banana</li></Draggable>
                                <Draggable type="fruit" data="apple"><li>Apple</li></Draggable>
                                <Draggable type="metal" data="silver"><li>Silver</li></Draggable>
                            </ul>
                            <Droppable
                                types={['fruit']} // <= allowed drop types
                                onDrop={this.onDrop.bind(this)}>
                                <ul className="Smoothie"></ul>
                            </Droppable>
                        </div>
                    </div>
                    <div className="calc-container-right">
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={20}>
                                <div className="div-title">
                                    <b>Destination</b>
                                </div>
                            </Col>
                        </FormGroup>
                        <hr />
                        
                    </div>
                    <br />
                </div>
                <br />
            </Panel>
        );

    }
};