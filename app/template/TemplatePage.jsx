import * as React from 'react';
import { Panel} from 'react-bootstrap';
import HRTemplatePanel from './HRTemplatePanel';
import ServiceTemplatePanel from './ServiceTemplatePanel';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {FaClinicMedical, FaUserNurse } from 'react-icons/fa';


export default class TemplatePage extends React.Component {

        constructor(props) {
                super(props);
        }

        render() {
                return (
                        <div>
                                <Panel bsStyle="primary" header="Data templates">
                                        <Tabs>
                                                <TabList>
                                                        <Tab><FaUserNurse /> Generate HR template</Tab>
                                                        <Tab><FaClinicMedical /> Generate service template</Tab>
                                                </TabList>

                                                <TabPanel>
                                                        <HRTemplatePanel />
                                                </TabPanel>

                                                <TabPanel>
                                                        <ServiceTemplatePanel />
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
