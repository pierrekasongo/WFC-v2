import * as React from 'react';
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
                        <table>
                            <tr>
                                <td>
                                    <a href="#" onClick={() => this.props.showDashboard(db.id,db.name,db.detail)} className="dashboard-link">
                                        {db.name}
                                    </a>
                                </td>
                            </tr>
                        </table>
                    )}
                </div>
            
        )
    }

};