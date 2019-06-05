import * as React from 'react';
import Collapsible from 'react-collapsible';
import { Panel, Form, FormGroup, ControlLabel, FormControl, Col, Checkbox, PanelGroup, Accordion } from 'react-bootstrap';
import FacilityPanel from './FacilityPanel';
import HRUploadPanel from './HRUploadPanel';
import ServiceUploadPanel from './ServiceUploadPanel';
import CadreUploadPanel from './CadreImportPanel';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { FaUserMd, FaClinicMedical, FaCapsules, FaUserNurse } from 'react-icons/fa';

export default class ImportPage extends React.Component {

        constructor(props) {
                super(props);
        }

        render() {
                return (
                        <div>
                                <Panel bsStyle="primary" header="Data import">
                                        <Tabs>
                                                <TabList>
                                                        <Tab><FaUserMd /> Cadres</Tab>
                                                        <Tab><FaCapsules /> Treatments</Tab>
                                                        <Tab><FaClinicMedical /> Facilities</Tab>
                                                        {/*<Tab><FaUserNurse /> HR</Tab>*/}
                                                </TabList>

                                                <TabPanel>
                                                        <CadreUploadPanel />
                                                </TabPanel>

                                                <TabPanel>
                                                        <ServiceUploadPanel />
                                                </TabPanel>

                                                <TabPanel>
                                                        <FacilityPanel />
                                                </TabPanel>

                                                {/*<TabPanel>
                                                        <HRUploadPanel />
                                                </TabPanel>*/}
                                        </Tabs>
                                </Panel>
                                <br />
                        </div>
                );
        }
};
