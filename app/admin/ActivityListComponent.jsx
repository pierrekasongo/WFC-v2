import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Button, FormControl, Col, Checkbox, Table } from 'react-bootstrap';

import ActivityItem from './ActivityItemComponent';

export default class ActivityListComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        }
    }
     render(){
         return(
             <div className="list-container">
                <ActivityItem />
                <ActivityItem />
             </div>
         );
     }

}