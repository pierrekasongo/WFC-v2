import * as React from 'react';
import Collapsible from 'react-collapsible';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button, Table } from 'react-bootstrap';
import axios from 'axios';

export default class CadreTimePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            cadres: [],
            cadreDict: {},
            cadreInputs: {},
            
            cadresSelected: {},
            
            cadreFilter: "",
            cadreToggle: true,
        };

        axios.get('/user/cadres').then(res => {
            let cadres = res.data;

            let cadreInputs = {};
            let cadreDict = {};
            cadres.forEach(cadre => {
                let hours = (cadre.Hours > 0) ? cadre.Hours : 40;
                let admin = (cadre.AdminTask > 0) ? cadre.AdminTask : 15;
                cadreInputs[cadre.id] = {
                    selected: false,
                    hours: hours,
                    adminPercentage: admin
                }
                cadreDict[cadre.id] = cadre.name;
                //cadresSelected[cadre.id]=true;
            });
            this.setState({
                cadres: cadres,
                cadreDict: cadreDict,
                cadreInputs: cadreInputs,
                //cadresSelected:cadresSelected
            });
        }).catch(err => console.log(err));
    }
    cadreHoursChanged(e, id) {

        let cadreInputs = this.state.cadreInputs;
        cadreInputs[id].hours = e.target.value;
        this.setState({ cadreInputs: cadreInputs });

        let data = {
            hours: e.target.value,
        };

        axios.patch('/user/cadre/hours/' + id, data).then(res => {
            this.setState({
                results: res.data
            });

        }).catch(err => console.log(err));
    }

    cadreAdminAmtChanged(e, id) {
        let cadreInputs = this.state.cadreInputs;
        cadreInputs[id].adminPercentage = e.target.value;
        this.setState({ cadreInputs: cadreInputs });

        let data = {
            admin_task: e.target.value,
        };

        axios.patch('/user/cadre/admin_work/' + id, data).then(res => {
            this.setState({
                results: res.data
            });

        }).catch(err => console.log(err));
    }
    filterCadres() {
        return this.state.cadres.filter(cadre => {
            let name = cadre['name'].toUpperCase();
            let filter = this.state.cadreFilter.toUpperCase();
            return name.indexOf(filter) > -1;
        });
    }

    render() {
        return(
            <div>
                <Panel bsStyle="primary" header="Cadre working time">
                <FormGroup>
                    <Col sm={10}>
                        <Row>
                            <Col xs={9}>
                                <div  style={{padding:10}}>
                                    <FormControl
                                        type="text"
                                        placeholder="filter cadres"
                                        value={this.state.cadreFilter}
                                        onChange={e => this.setState({ cadreFilter: e.target.value })} />
                                </div>
                                <div style={{ overflowY: "scroll", minHeight: 450, maxHeight: 450,paddingLeft:10 }}>
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                <th style={{ width: "30%" }}>Cadre</th>
                                                <th style={{ width: "10%" }}>Hours/Week</th>
                                                <th style={{ width: "30%" }}>Percentage of time spent on administrative tasks</th>
                                                <th style={{ width: "30%" }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.filterCadres().map(cadre =>
                                                <tr key={cadre.id}>
                                                    <td align="left">
                                                        {cadre.name}
                                                    </td>
                                                    <td>
                                                        <FormControl
                                                            type="number"
                                                            style={{ width: 75 }}
                                                            disabled={!this.state.cadreInputs[cadre.id]}
                                                            value={cadre.Hours}
                                                            onChange={e => this.cadreHoursChanged(e, cadre.id)} />
                                                    </td>
                                                    <td>
                                                        <FormControl
                                                            type="number"
                                                            style={{ width: 75 }}
                                                            disabled={!this.state.cadreInputs[cadre.id]}
                                                            value={cadre.AdminTask}
                                                            onChange={e => this.cadreAdminAmtChanged(e, cadre.id)} />
                                                    </td>
                                                    <td>
                                                        <Button bsStyle="warning" className="btn-bulk" bsSize="small" onClick={() => this.cancel()}>Edit</Button>
                                                        <Button bsStyle="warning" className="btn-bulk" bsSize="small" onClick={() => this.cancel()}>Cancel</Button>
                                                        <Button bsStyle="warning" className="btn-bulk" bsSize="small" onClick={() => this.save(this.state)}>Save</Button>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </FormGroup>
                <br/>
                </Panel>
            </div>
        )}

};