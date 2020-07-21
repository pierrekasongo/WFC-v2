import * as React from 'react';
import Collapsible from 'react-collapsible';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import InlineEdit from 'react-edit-inline2';
import Multiselect from 'react-multiselect-checkboxes';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

import HRUploadPanel from './HRUploadPanel';

import ServiceUploadPanel from './ServiceUploadPanel';

export default class StatisticsPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {      
        };
    }

    render() {
        return (
            <Panel bsStyle="primary" header="Import service and HR data">
                <Tabs>
                    <TabList>
                        <Tab>Activity statistics</Tab>
                        <Tab>HR data</Tab>   
                    </TabList>

                    <TabPanel>
                        <ServiceUploadPanel />     
                    </TabPanel>
                    <TabPanel>
                        <HRUploadPanel />
                    </TabPanel>
                </Tabs>
            </Panel>
        );

    }
};