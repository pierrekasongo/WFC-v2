import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button, Table } from 'react-bootstrap';
import axios from 'axios';

export default class HRUploadPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            progress:'',
            workforces:[],
        };
      
        this.handleUploadHR = this.handleUploadHR.bind(this);
        this.uploadHR=this.uploadHR.bind(this);

        axios.get('/user/workforce').then(res => {

          let workforces = {};   

          res.data.forEach(workforce => {

            workforces[workforce.id]={

              id:workforce.id,
              facility:workforce.facility,
              nb_staff:workforce.staff,
              cadre:workforce.cadre
            }
          });
          this.setState({ workforces: workforces });
      }).catch(err => console.log(err));
    }

    handleUploadHR(ev) {

        ev.preventDefault();
    
        const data = new FormData();
        data.append('file', this.uploadInputHR.files[0]);
        data.append('type', 'hr');

        axios.post('/ihris/upload', data,
        {
        onUploadProgress: progressEvent => {
            var prog=(progressEvent.loaded / progressEvent.total)*100;
            var pg=(prog < 100)?prog.toFixed(2):prog.toFixed(0);
            this.setState({progress:pg});
            //console.log(pg+"%");
        }})
        .then((result) => {
            //console.log(result.data);
            this.setState({progress:result.data});
        }).catch(err=>console.log(err));
   }

  uploadHR(ev){
    this.setState({progress:'Downloading...'});
    axios.get(`/ihris/download_hr`).then(res => {
        //console.log(res);
        //progress=res;
        this.setState({progress:"Done"});
    }).catch(err => console.log(err));
  }

  render() {
        return (
          [
          <hr key="2"/>,
          <div>
            <span><h4 >Load the available HR data from iHRIS</h4></span>
            <Button onClick={this.uploadHR} bsStyle="warning" bsSize="small">Load HR data from iHRIS</Button><span> {this.state.progress}</span>
            
          </div>,
          <hr key="3" />,
          <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>Availaible workforce</Col>
          <Col sm={10}>
              <Row>
                
                  <Col sm={10}>
                      {/*<div style={{ overflowY: "scroll", minHeight: 250, maxHeight: 250 }}>*/}
                      <div style={{ overflowY: "scroll", minHeight: 250, maxHeight: 250 }}>
                          <Table striped hover>
                              <thead>
                                  <tr>
                                      <th style={{ width: "10%" }}>Staff</th>
                                      <th style={{ width: "30%" }}>Cadre</th>
                                      <th style={{ width: "60%" }}>Facility</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {Object.keys(this.state.workforces).map(id =>
                                      <tr>
                                          <td>
                                              <h6>{this.state.workforces[id].nb_staff}</h6>
                                          </td>
                                          <td>
                                              <h6>{this.state.workforces[id].cadre}</h6>
                                          </td>
                                          <td>
                                              <h6>{this.state.workforces[id].facility}</h6>
                                          </td>
                                          
                                      </tr>
                                  )}
                              </tbody>
                          </Table>
                      </div>
                  </Col>
              </Row>
          </Col>
          </FormGroup>,
          ]

        )
      }
      
};