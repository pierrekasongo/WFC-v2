import * as React from 'react';
import Collapsible from 'react-collapsible';
import { Panel, Form, FormGroup, ControlLabel, FormControl, Col, Checkbox,PanelGroup,Accordion } from 'react-bootstrap';
import WPCPanel from './WPCPanel';
import PredictivePanel from './PredictivePanel';
import WUPanel from './WUPanel';

export default class UserPage extends React.Component {

    constructor(props) {
        super(props);

    }

    render(){
        return(
        <div>
            <Panel bsStyle="primary" header="Pressure Calculation">
                <WPCPanel />
                {/*<Collapsible  trigger="Work Force Pressure Calculator">
                        <WPCPanel />
                </Collapsible>

                <Collapsible  trigger="Predictive Work Force Pressure Calculator">
                        <PredictivePanel />
                </Collapsible>

                <Collapsible  trigger="Workforce Utilization">
                        <WUPanel />
            </Collapsible>*/}
            </Panel>
        </div>
     
        );
      }

    /*render(){
        return (
            <div>
                <Accordion defaultActiveKey="1">
                    <Panel bsStyle="primary" header="Work Force Pressure Calculator" eventKey="1">
                        <WPCPanel />
                    </Panel>
                    <Panel bsStyle="warning" header="Predictive Work Force Pressure Calculator" eventKey="2">
                        <PredictivePanel />
                    </Panel>
                    <Panel bsStyle="success" header="Workforce Utilization" eventKey="3">
                        <WUPanel />
                    </Panel>
                </Accordion>
            </div>
        );
    }*/
};
