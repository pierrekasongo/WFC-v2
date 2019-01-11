import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Checkbox, Table, ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

import InlineEdit from 'react-edit-inline2';

export default class TreatmentComponent extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }
    validateValue(text) {

        var tryparse=require('tryparse');
        return tryparse.int(text);
    }

    handleChange(obj) {

        const id = Object.keys(obj)[0];

        const value = Object.values(obj)[0];

        let data = {
            value: value,
        };
        axios.patch('/admin/activity_duration/' + id, data).then(res => {
            console.log('Value updated successfully');
        }).catch(err => console.log(err));
    }
    render() {
        return (
            <tr>
                <td>{this.props.treatment}</td>
                <td>{this.props.cadre}</td>
                <td>
                    {/*this.props.duration*/}
                    <div>
                        <InlineEdit
                            validate={this.validateValue}
                            activeClassName="editing"
                            text={this.props.duration}
                            paramName={this.props.id}
                            change={this.handleChange}
                            style={{
                                /*backgroundColor: 'yellow',*/
                                minWidth: 150,
                                display: 'inline-block',
                                margin: 0,
                                padding: 0,
                                fontSize: 15,
                                outline: 0,
                                border: 1
                            }}
                        />
                    </div>
                </td>
                <td>
                    <ButtonToolbar>
                        {/*<Link to={this.props.manageLink}>
                            <Button bsStyle="info" onClick={() => this.props.manage()}>Manage Treatment by Cadre</Button>
                        </Link>*/}
                        <Button bsStyle="warning" bsSize="small" onClick={() => this.props.delete()}>Delete</Button>
                    </ButtonToolbar>
                </td>
            </tr>
        );
    }

}