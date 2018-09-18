import * as React from 'react';
import Collapsible from 'react-collapsible';
import { Panel, Form, FormGroup, ControlLabel, FormControl, Col, Checkbox,PanelGroup,Accordion } from 'react-bootstrap';
import FacilityPanel from './FacilityPanel';
import uploadPanel from './HRUploadPanel';
import UploadiHRISPanel from './HRUploadPanel';
import HRUploadPanel from './HRUploadPanel';
import ServiceUploadPanel from './ServiceUploadPanel';
import SyncDataPanel from './SyncDataPanel';
import SynchDataPanel from './SyncDataPanel';
import CadreUploadPanel from './CadreImportPanel';

export default class ImportPage extends React.Component {

    constructor(props) {
        super(props);

    }

    render(){
        return(
        <div>
            <Collapsible  trigger="Import facilities from DHIS2">
                    <FacilityPanel />
            </Collapsible>

            <Collapsible  trigger="Import Treatments from DHIS2">
                    <ServiceUploadPanel />
            </Collapsible>

            <Collapsible  trigger="Import HR data from iHRIS">
                    <HRUploadPanel />
            </Collapsible>
            <Collapsible  trigger="Import cadres from iHRIS">
                    <CadreUploadPanel />
            </Collapsible>
            <Collapsible  trigger="Sync data to match IDs">
                    <SynchDataPanel />
            </Collapsible>
        </div>
     
        );
      }

};
