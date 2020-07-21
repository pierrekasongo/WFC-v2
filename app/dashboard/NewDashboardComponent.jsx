import * as React from 'react';

import 'toastr/build/toastr.min.css';
import {FaCheck,FaTrash} from 'react-icons/fa';

export default class NewDashboardComponent extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            name:'',
            description:''
        };
    }

    render() {
        return (
            <div>
                    <div className="div-title">
                    Add new dashboard
                    </div>
                    <table>
                        <tr>
                            <td>Name</td>
                            <td>
                                <input type="text"
                                    placeholder="Name"
                                    value={this.state.name}
                                    onChange={e => this.setState({ name: e.target.value })} />
                            </td>
                        </tr>
                        <tr>
                            <td>Description</td>
                            <td>
                                <input type="text"
                                        placeholder="Description"
                                        value={this.state.description}
                                        onChange={e => this.setState({ description: e.target.value })} />
                            </td>
                        </tr>
                        
                    </table>
                    <hr/>
                    <table>
                        <tr>
                            <td>
                                <button className="button" onClick={() => this.props.save(this.state)}><FaCheck /> Save</button>
                            
                            </td>
                            <td>
                                <button className="button-cancel" onClick={() => this.props.cancel()}><FaTrash /> Cancel</button>                  
                            </td>
                        </tr>
                    </table>
                
            </div>
        )
    }
};