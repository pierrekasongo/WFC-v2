import * as React from 'react';
import { Panel } from 'react-bootstrap';
import {FaArrowLeft,FaArrowRight} from 'react-icons/fa';

import 'rc-steps/assets/index.css';
import 'rc-steps/assets/iconfont.css';
import Steps, { Step } from 'rc-steps';


import ImportPage from '../import/ImportPage';
import AdminPage from '../admin/AdminPage';
import CadreTimePage from '../user/CadreTimePage';
import StatisticsPage from '../admin/StatisticsPage';
import UserPage from '../user/UserPage';
import TreatmentMatchPage from '../admin/TreatmentMatchPage';

const importData_desc = 'Import all required data from dhis2, ihris or csv files into the system.';

//const activityDuration_desc='Set time(duration) for each treatment(activity) involved in the calculation.';

const cadreTime_desc ='Set cadre working and not working time.';

const serviceMatch_desc ='Match treatment with Dhis2 codes.';

const startImport_desc = 'Import service activities annual statistics.';

const calculation_desc='Calculate the workforce pressure.';

export default class StartPage extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            currentStep:0,
            maxSteps:4,
        }
    }
    nexStep(){

        let current=this.state.currentStep;

        let maxSteps=this.state.maxSteps;
        
        if(current < maxSteps){
            current++;
            this.setState({
                currentStep:current
            });
            
        }else{
            this.setState({currentStep:0});
        }
    }
    previousStep(){

        let current=this.state.currentStep;
        
        if(current >= 0){
            current--;
            this.setState({
                currentStep:current
            });
            
        }else{
            this.setState({currentStep:0});
        }
    }
    render() {
        return (
            <div>
                <Panel bsStyle="primary" header="Start process">                
                    <div class="container-fluid bg-3">
                        <div style={{marginTop:5}}>
                            <Steps current={this.state.currentStep}>
                                <Step title="Import" description={importData_desc} />
                                {/*<Step title="Time on treatment" description={activityDuration_desc} />*/}
                                <Step title="Cadre worktime" description={cadreTime_desc} />
                                <Step title="Treatments matching" description={serviceMatch_desc} />
                                <Step title="Annual statistics" description={startImport_desc} />
                                <Step title="Workload calculation" description={calculation_desc} />
                            </Steps>
                            <div className="div-steps">
                                <span>
                                    <button className="button-step" onClick={() => this.previousStep()}><FaArrowLeft /></button>
                                </span>
                                <span>
                                    <button className="button-step" onClick={() => this.nexStep()}><FaArrowRight /></button>
                                </span>
                            </div>
                            <hr/>
                            {(this.state.currentStep == 0) && 
                                <ImportPage />
                            }
                            {/*(this.state.currentStep == 1) && 
                                <AdminPage />
                            */}
                            {(this.state.currentStep == 1) && 
                                <CadreTimePage />
                            }
                            {(this.state.currentStep == 2) && 
                                <TreatmentMatchPage />
                            }
                            {(this.state.currentStep == 3) && 
                                <StatisticsPage />
                            }
                            {(this.state.currentStep == 4) && 
                                <UserPage />
                            }
                        </div>
                    </div>                        
                </Panel>
                
            </div>
        );
    }

};