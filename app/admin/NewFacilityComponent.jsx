import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Checkbox, Table } from 'react-bootstrap';
import {FaCheck,FaTimes } from 'react-icons/fa';

import {default as UUID} from "uuid"; 

export default class NewFacilityComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
           code:'',
           region:'',
           district:'',
           regions:[],
           districts:[]
        }
    }
    componentDidMount(){
        this.setState({code:UUID.v4()});
        setParents();
    }
    setParents(){
        this.props.facilities.forEach(fa => {
            this.state.regions.push({
                code:fa.region,
                name:fa.region
            });
            this.state.districts.push({
                code:fa.district,
                name:fa.district
            })
        })
    }
    render() {
        return (
            <tr>
                <td style={{ fontSize: 14 }}>
                    <select onChange={e => this.setState({ region: e.target.value })}
                        value={this.state.region}>
                        <option value="000">Select value</option>
                        {this.state.regions.map(rg =>
                            <option
                                key={rg.code}
                                value={rg.name}>
                                {rg.name}
                            </option>
                        )}
                    </select>
                </td>
                <td style={{ fontSize: 14 }}>
                    <select onChange={e => this.setState({ district: e.target.value })}
                        value={this.state.district}>
                        <option value="000">Select value</option>
                        {this.state.districts.map(dist =>
                            <option
                                key={dist.code}
                                value={dist.name}>
                                {dist.name}
                            </option>
                        )}
                    </select>
                </td>
                <td style={{fontSize:14}}>
                    <input type="text"
                            placeholder="Name"
                            value={this.state.name}
                            onChange={e => this.setState({ name: e.target.value })} />
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