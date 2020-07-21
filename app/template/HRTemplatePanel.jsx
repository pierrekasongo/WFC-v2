import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import { FaCheck, FaTrash, FaEdit, FaCheckSquare } from 'react-icons/fa';
import { confirmAlert } from 'react-confirm-alert';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import InlineEdit from 'react-edit-inline2';

import ExcelHRComponent from './ExcelHRComponent';

export default class HRTemplatePanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            cadres: [],
            facilities: []
        };
        axios.get('/cadre/cadres').then(res => {

            this.setState({ cadres: res.data });

        }).catch(err => console.log(err));

        axios.get('/facility/facilities').then(res => {

            this.setState({ facilities: res.data });

        }).catch(err => console.log(err));
    }

    render() {
        return (
            <div className="tab-main-container">
                <Form horizontal>
                    <div>
                        <div class="alert alert-warning" role="alert">
                            <p>You can generate an Excel template for HR data by clicking below button.</p>
                           
                        </div>

                        <ExcelHRComponent 
                            facilities={this.state.facilities}
                            cadres={this.state.cadres}
                        />
                    </div>
                </Form>
            </div>
        )
    }

};