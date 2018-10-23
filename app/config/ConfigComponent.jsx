import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Checkbox, Table, ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router-dom'

export default class ConfigComponent extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {
        return (
            <tr>
                <td>{this.props.parameter}</td>
                <td>{this.props.value}</td>
                <td>
                    <ButtonToolbar>
                        <Link to={this.props.manageLink}>
                            <Button bsStyle="info" /*onClick={() => this.props.manage()}*/>Edit</Button>
                        </Link>

                    </ButtonToolbar>
                </td>
            </tr>
        );
    }

}