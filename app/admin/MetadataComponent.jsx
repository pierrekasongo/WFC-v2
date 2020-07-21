import * as React from 'react';
import Collapsible from 'react-collapsible';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Row, Radio, Checkbox, Table } from 'react-bootstrap';
import * as axios from 'axios';
import { Route, Redirect, Switch, Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import InlineEdit from 'react-edit-inline2';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FaTrash, FaCloudUploadAlt, FaCheck, FaPlusSquare, FaCapsules, FaUserMd, FaGlobe, FaEdit,FaClinicMedical } from 'react-icons/fa';

import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

import TreatmentComponent from './TreatmentComponent';
import FacilityTypeComponent from './FacilityTypeComponent';
import FacilityComponent from './FacilityComponent';
import CadreComponent from './CadreComponent';

export default class MetadataComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        };
    }
    render() {
        return (
            <Panel bsStyle="primary" header="Metadata configuration">
                <Tabs>
                    <TabList>
                        <Tab><FaClinicMedical /> Facility types</Tab>
                        <Tab><FaUserMd /> Cadres/Worktime</Tab>
                        <Tab><FaClinicMedical /> Facilities</Tab>
                        <Tab><FaCapsules /> Activities</Tab>                      
                        {/*<Tab><FaGlobe /> Countries</Tab>*/}
                    </TabList>
                    <TabPanel>
                        <FacilityTypeComponent />
                    </TabPanel>
                    <TabPanel>
                        <CadreComponent />
                    </TabPanel>
                    <TabPanel>
                        <FacilityComponent />
                    </TabPanel>

                    <TabPanel>
                        <TreatmentComponent />
                    </TabPanel>
                    {/*<TabPanel>
                        <CountryComponent countries={this.state.countries} />
                    </TabPanel>*/}
                </Tabs>
                <br />
                <br />
            </Panel>
        )
    }
};