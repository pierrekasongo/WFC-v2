import * as React from 'react';
import Collapsible from 'react-collapsible';
import { Button, Table } from 'react-bootstrap';

import CsvComponent from './CsvComponent';

export default class ResultComponent extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            cadreDict: props.cadreDict,
            results:props.results
        };
    }
    render() {
        return ([
            <br />,
            <CsvComponent
                results={this.state.results}
                cadreDict={this.state.cadreDict}
            />,

            Object.keys(this.state.results).map(id =>
                <Collapsible trigger={this.state.results[id].facility}>
                    <div >
                        <h3>Results for {this.state.results[id].facility}</h3>
                        <br />

                        <Table hover striped>
                            <thead>
                                <tr>
                                    <th>Cadre</th>
                                    <th>Current Workers</th>
                                    <th>Workers Needed</th>
                                    <th>Workforce Pressure</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(this.state.results[id].workersNeeded).map(cadreId =>
                                    <tr>
                                        <td>
                                            <h4 key={cadreId + 'cadre'}>{this.state.cadreDict[cadreId]}</h4>
                                        </td>
                                        <td>
                                            <h4 key={cadreId + 'current'}>{this.state.results[id].currentWorkers[cadreId]}</h4>
                                        </td>
                                        <td>
                                            <h4 key={cadreId + 'needed'}>{Math.round(this.state.results[id].workersNeeded[cadreId])}</h4>
                                        </td>
                                        <td>
                                            {this.state.results[id].pressure[cadreId] &&
                                                <h4
                                                    key={cadreId}
                                                    style={{ color: this.state.results[id].pressure[cadreId] < 1 ? "red" : "green" }}>
                                                    {Number(this.state.results[id].pressure[cadreId]).toFixed(2)}x
                                        </h4>
                                            }
                                            {!this.state.results[id].pressure[cadreId] &&
                                                <h4 key={cadreId} style={{ color: "gray" }}>N/A</h4>
                                            }
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                        <br />

                    </div>
                </Collapsible>
            )]
        )
    }

};