import * as React from 'react';
import { Panel } from 'react-bootstrap';

export default class StartPage extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Panel bsStyle="primary" header="Start process">
                <br/><br/>
                    <div class="container-fluid bg-3">
                        <div class="row">
                            <div class="col-sm-4">
                                <a href="/import">
                                    <button type="button" class="btn btn-info">1</button>
                                </a>
                                <p>Import all required data from dhis2, ihris or csv files into the system.</p>
                            </div>
                            <div class="col-sm-4">
                                <a href="/admin">
                                    <button type="button" class="btn btn-info">2</button>
                                </a>
                                <p>Set time(duration) for each treatment(activity) involved in the calculation.</p>
                            </div>
                            <div class="col-sm-4">
                                <a href="/cadre-time">
                                    <button type="button" class="btn btn-info">3</button>
                                </a>
                                <p>Set cadre work time and administrative task time.</p>
                            </div>
                            <div class="col-sm-4">
                                <a href="/statistics">
                                    <button type="button" class="btn btn-info">4</button>
                                </a>
                                <p>Import annual treatments data.</p>
                            </div>
                            
                            <div class="col-sm-4">
                                <a href="/user">
                                    <button type="button" class="btn btn-info">5</button>
                                </a>
                                <p>Calculate the workforce pressure.</p>
                            </div>
                        </div>
                    </div>                        
                </Panel>
                
            </div>
        );
    }

};