import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button, Table } from 'react-bootstrap';
import axios from 'axios';

export default class SynchDataPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            workforces:[],
            facilities: [],
        };
        this.synchData = this.synchData.bind(this);  
    
        axios.get('/user/all_workforce').then(res => {

          this.state.workforces=res.data;

        }).catch(err => console.log(err));

        axios.get('/user/facilities').then(res =>{
            
            let facilities={};

            let index=0;

            res.data.forEach(facility => {
                facilities[index]={
                    id:facility.Id,
                    name:facility.Name,
                    code:facility.FacilityCode,
                }
                index++;
            });
            this.setState({facilities:facilities});

            //console.log(facilities);

        }).catch(err => console.log(err));
    }

    synchData(ev) {

        //ev.preventDefault();
        const obj = Object.getOwnPropertyNames(this.state.facilities);

        let size=obj.length;

        this.state.workforces.forEach(workforce => {

            let facilityCode=workforce.facilityCode;

            let personId=workforce.id;

            for(var i=0;i < size;i++){

                let code=this.state.facilities[i].code;

                if(facilityCode == code){
                    
                    let data = {
                        facilityId: this.state.facilities[i].id,
                    };
            
                    axios.patch('/user/workforce/'+personId, data).then(res => {
                        
                        
                    }).catch(err => console.log(err));

                    break;
                }
            }
        });
    }

    render() {
        return (
            <table>
                <tbody>
                    <tr>
                        <td>
                            <div style={{ textAlign: "left", paddingTop: 10 }}>
                                <Button bsStyle="warning" bsSize="large" onClick={() => this.synchData()}>Sync facilities and workforce</Button>
                            </div>
                        </td>
                       
                    </tr>
                </tbody>
            </table>
            
        )
      }
      
};