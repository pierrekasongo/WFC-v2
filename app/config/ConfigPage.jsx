import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Checkbox, Table } from 'react-bootstrap';
import { Route, Redirect, Switch, Link } from 'react-router-dom'

import ConfigPanel from './ConfigPanel';

export default class ConfigPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div>
                <Panel bsStyle="primary" header="Configuration">
                    <Route component={ConfigPanel} />
                </Panel>
                
            </div>
        );
    }

};