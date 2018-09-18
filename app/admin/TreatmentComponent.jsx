import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Checkbox, Table, ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router-dom'

export default class TreatmentComponent extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {
        return (
            <tr>
                <td>{this.props.treatment}</td>
                <td>{this.props.cadre}</td>
                <td>{this.props.duration}</td>
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