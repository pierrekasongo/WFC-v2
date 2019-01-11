import * as React from 'react';
import Collapsible from 'react-collapsible';
import { Panel, Form, FormGroup, ControlLabel, FormControl, Col, Checkbox,PanelGroup,Accordion } from 'react-bootstrap';
import {Draggable,Droppable} from 'react-drag-and-drop';
import axios from 'axios';
//import CheckboxTree from 'react-checkbox-tree';

export default class HomePage extends React.Component {

    constructor(props) {
        super(props);

        this.state={
            activitiesCount:0,
            facilitiesCount:0,
            staffCount:0,
            cadreCount:0,
            staffs:[],
            cadres:[]
        };

        /*axios.get('/admin/count')
            .then(res => this.setState({ count: res.nb }))
            .catch(err => console.log(err));*/


        axios.get('/admin/count_activities').then(res => {
                this.setState({
                    activitiesCount: res.data[0].nb
                });
                
        }).catch(err => console.log(err));

        axios.get('/user/count_facilities').then(res => {
            this.setState({
                facilitiesCount: res.data[0].nb
            });           
        }).catch(err => console.log(err));

        axios.get('/user/count_staffs').then(res => {
            this.setState({
                staffCount: res.data[0].nb
            });           
        }).catch(err => console.log(err));

        axios.get('/user/staff_per_cadre').then(res => {
            this.setState({
                staffs:res.data
            });

        }).catch(err => console.log(err));

        axios.get('/user/count_cadres').then(res => {
            this.setState({
                cadreCount: res.data[0].nb
            });           
        }).catch(err => console.log(err));

        axios.get('/user/cadres').then(res => {
            this.setState({
                cadres:res.data
            });

        }).catch(err => console.log(err));
    }

    renderDashboard() {
        return (
            <div className="intro-screen">
                <Panel bsStyle="primary" header="Home">
                <br />
                <div class="container">
                        <div class="row">
                        <div class="col-md-4 col-xl-3">
                                <div class="card bg-c-pink order-card">
                                    <div class="card-block">
                                        <h6 class="m-b-20">Cadres ({this.state.cadres.length})</h6>
                                        {/*<h2 class="text-right"><i class="fa fa-users f-left"></i><span>{this.state.cadreCount}</span></h2>*/}
                                        <ul>
                                            {Object.keys(this.state.cadres).map(id => 
                                                <li>{this.state.cadres[id].name}</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 col-xl-3">
                                <div class="card bg-c-yellow order-card">
                                    <div class="card-block">
                                        <h6 class="m-b-20">Staffs</h6>
                                        {/*<h2 class="text-right"><i class="fa fa-user-md f-left"></i><span>{this.state.staffCount}</span></h2>*/}
                                        <ul>
                                            {Object.keys(this.state.staffs).map(id => 
                                                <li>{this.state.staffs[id].cadre}&nbsp;: {this.state.staffs[id].nb}</li>
                                            )}
                                        </ul>
                                         
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-md-4 col-xl-3">
                                <div class="card bg-c-blue order-card">
                                    <div class="card-block">
                                        <h6 class="m-b-20">Treatments</h6>
                                        <h2 class="text-right"><i class="fa fa-stethoscope f-left"></i><span>{this.state.activitiesCount}</span></h2>
                                        {/*<p class="m-b-0">Completed Orders<span class="f-right">351</span></p>*/}
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-md-4 col-xl-3">
                                <div class="card bg-c-green order-card">
                                    <div class="card-block">
                                        <h6 class="m-b-20">Facilities</h6>
                                        <h2 class="text-right"><i class="fa fa-hospital f-left"></i><span>{this.state.facilitiesCount}</span></h2>
                                        {/*<p class="m-b-0">Completed Orders<span class="f-right">351</span></p>*/}
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </Panel>
                
            </div>
        );
    }

    render() {
        return (
            this.renderDashboard()
        );
    }

};
