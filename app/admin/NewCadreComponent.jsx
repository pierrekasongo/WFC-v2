import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Checkbox, Table } from 'react-bootstrap';
import {FaCheck,FaTimes } from 'react-icons/fa';

export default class NewCadreComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            code:'',
            name:'',
            worktime:'',
            admin_task:''
        }
    }
    render() {
        return (
            <tr>
                <td style={{fontSize:14}}>
                    <input type="text"
                            placeholder="Code"
                            value={this.props.cadre.code}
                            onChange={e => this.setState({ code: e.target.value })} />
                </td>
                <td style={{fontSize:14}}>
                    <input type="text"
                            placeholder="Name"
                            value={this.props.cadre.name}
                            onChange={e => this.setState({ name: e.target.value })} />
                </td>
               
                <td style={{fontSize:14}}>
                    <input type="text"
                            placeholder="Worktime"
                            value={this.props.cadre.worktime}
                            onChange={e => this.setState({ worktime: e.target.value })} />
                </td>
                <td style={{fontSize:14}}>
                    <input type="text"
                            placeholder="Admin. Task(%)"
                            value={this.props.cadre.admin_task}
                            onChange={e => this.setState({ admin_task: e.target.value })} />
                </td>
                <td>
                    <a href="#" className="add-new-link" onClick={() => this.props.cancel()}><FaTimes /></a>
                </td> 
                <td>
                    <a href="#" className="add-new-link" onClick={() => this.props.save(this.state)}><FaCheck /></a>
                </td>
            </tr>
        );
    }

}