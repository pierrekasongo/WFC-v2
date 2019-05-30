import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Checkbox, Table } from 'react-bootstrap';
import * as axios from 'axios';

import InlineEdit from 'react-edit-inline2';
import UserPage from './UserPage';

export default class ConfigPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            configs: {},
            filter: "",
        }

        axios.get('/configuration/configs')
            .then(res => this.setState({ configs: res.data }))
            .catch(err => console.log(err));

        this.handleChange = this.handleChange.bind(this);
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

    getFilteredConfigs() {
        return Object.keys(this.state.configs).filter(val => {
            let config = this.state.configs[val].parameter.toUpperCase();
            let filter = this.state.filter.toUpperCase();
            return config.indexOf(filter) > -1;
        });
    }

    render() {
        return (
            <Panel bsStyle="primary" header="Configuration">
                <div className="tab-main-container">
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={20}>
                            <div className="div-title">
                                <b>Variables de configuration</b>
                            </div>
                        </Col>
                    </FormGroup>
                    <table className="table-list">
                        <thead>
                            <tr>
                                <th>Parameter</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.getFilteredConfigs().map(paramId =>
                                <tr key={paramId}>
                                    <td>{this.state.configs[paramId].parameter}</td>
                                    <td>
                                        <div>
                                            <InlineEdit
                                                validate={this.validateValue}
                                                activeClassName="editing"
                                                text={this.state.configs[paramId].value}
                                                paramName={this.state.configs[paramId].id}
                                                change={this.handleChange}
                                                style={{
                                                    /*backgroundColor: 'yellow',*/
                                                    minWidth: 150,
                                                    display: 'inline-block',
                                                    margin: 0,
                                                    padding: 0,
                                                    fontSize: 15,
                                                    outline: 0,
                                                    border: 0
                                                }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <br />
                    <UserPage />
                </div>
            </Panel>
        );
    }
};