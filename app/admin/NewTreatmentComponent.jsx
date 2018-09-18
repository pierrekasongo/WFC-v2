import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Checkbox, Table } from 'react-bootstrap';

export default class NewTreatmentComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            //name: "",
            treatmentId:Object.keys(props.treatments)[0],
            cadreId: Object.keys(props.cadres)[0],
            duration:0
        }
    }
    render() {
        return (
            <tr>
                <td>
                    <FormControl
                            componentClass="select"
                            onChange={e => this.setState({ treatmentId: e.target.value })}
                            value={this.state.treatmentId}>
                            {Object.keys(this.props.treatments).map(treatmentId =>
                                <option
                                    key={treatmentId}
                                    value={treatmentId}>
                                    {this.props.treatments[treatmentId]}
                                </option>
                            )}
                    </FormControl>
                </td>
                <td>
                    <FormControl
                        componentClass="select"
                        onChange={e => this.setState({ cadreId: e.target.value })}
                        value={this.state.cadreId}>
                        {Object.keys(this.props.cadres).map(cadreId =>
                            <option
                                key={cadreId}
                                value={cadreId}>
                                {this.props.cadres[cadreId]}
                            </option>
                        )}
                    </FormControl>
                </td>
                <td>
                    <FormControl
                        type="number"
                        value={this.state.duration}
                        onChange={e => this.setState({duration:e.target.value})}
                    />
                </td>
                <td>
                    <Button onClick={() => this.props.save(this.state)}>Save</Button>
                    <Button onClick={() => this.props.cancel()}>Cancel</Button>
                </td>
            </tr>
        );
    }

}