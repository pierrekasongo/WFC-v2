
import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Checkbox, Table } from 'react-bootstrap';
import * as axios from 'axios';

import InlineEdit from 'react-edit-inline2';

export default class ConfigPanel extends React.Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.state = {
            configs: {},
            filter: "",
        }

        axios.get('/configuration/configs')
            .then(res => this.setState({ configs: res.data }))
            .catch(err => console.log(err));
    }
    validateValue(text) {
        return (text.length > 0 && text.length < 64);
    }

    handleChange(obj) {

        const id = Object.keys(obj)[0];

        const value=Object.values(obj)[0];

        let data = {
            value: value,
        };
        axios.patch('/configuration/config/' + id, data).then(res => {

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
            <div>
                <FormGroup type>
                    <ControlLabel>Filter</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.filter}
                        placeholder="Parameter"
                        onChange={e => this.setState({ filter: e.target.value })}
                    />
                </FormGroup>
                <Table>
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
                </Table>
            </div>
        );
    }
}