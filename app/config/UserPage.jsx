import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Checkbox, Table } from 'react-bootstrap';
import * as axios from 'axios';

import InlineEdit from 'react-edit-inline2';

export default class UserPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            users:[]
        }

        axios.get('/auth/users')
            .then(res => this.setState({ users: res.data }))
            .catch(err => console.log(err));
    }

    validateValue(text) {
        return (text.length > 0 && text.length < 64);
    }

    handleChange(obj) {

        const id = Object.keys(obj)[0];

        const value = Object.values(obj)[0];

        let data = {
            id: id,
            value: value,
        };
        axios.patch('/configuration/config', data).then(res => {

            console.log('Value updated successfully');

        }).catch(err => console.log(err));
    }

    render() {
        return (
                <div>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={20}>
                            <div className="div-title">
                                <b>Users</b>
                            </div>
                        </Col>
                    </FormGroup>
                    <table className="table-list">
                        <thead>
                            <tr>
                                <th>Login</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Rôle</th>
                                <th>Last login</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.users.map(user =>
                                <tr key={user.id}>
                                    <td>{user.login}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{user.last_login}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <br/>
                </div>
        );
    }
};