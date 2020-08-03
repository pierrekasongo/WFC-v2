import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, FormControl, Col, Checkbox,PanelGroup,Accordion } from 'react-bootstrap';
import 'toastr/build/toastr.min.css';


export default class DashboardListComponent extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
        };
    }

    render() {
        return (
        <div className="dashboard-list-div">
            {this.props.dashboards.map(db =>
                <div>
                    <div className="dashboard-itm">
                        <input type="radio" value={db.id} checked={this.props.selected.id === db.id} 
                           onChange ={() => this.props.showDashboard(db.id,db.name,db.detail)}/>
                    </div>
                    <div className="dashboard-itm">
                        <a href="#" onClick={() => this.props.showDashboard(db.id,db.name,db.detail)} className="dashboard-link">
                            {db.name}
                        </a>
                    </div>
                </div>
            )}
        </div>
        )
    }

};