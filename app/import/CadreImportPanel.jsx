import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button, Table } from 'react-bootstrap';
import axios from 'axios';

export default class CadreImportPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            progress_cadre:'',
            cadres: [],
        };
      
        //this.handleUploadCadre = this.handleUploadCadre.bind(this);
        this.uploadCadre = this.uploadCadre.bind(this);

        axios.get('/user/cadres').then(res => {
            let cadres = {};
            res.data.forEach(cadre => {

              cadres[cadre.id]={
                id:cadre.id,
                name:cadre.name
              }
            });

            this.setState({ cadres: cadres });
        }).catch(err => console.log(err));
    }
    handleUploadCadre(ev) {

        ev.preventDefault();
    
        const data = new FormData();
        data.append('file', this.uploadInputCadre.files[0]);
        data.append('type', 'cadre');

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
           this.setState({progress_cadre:result.data});
      }).catch(err=>console.log(err));
    }

    uploadCadre(ev){
        this.setState({progress:'Downloading...'});
        axios.get(`/ihris/download_cadres`).then(res => {
            this.setState({progress:"Done"});
        }).catch(err => console.log(err));
    }
    
    render() {
        return (
          [
          <div>
            <span><h4 >Load cadres from iHRIS</h4></span>
            <Button onClick={this.uploadCadre} bsStyle="warning" bsSize="small">Load cadres  from iHRIS</Button><span> {this.state.progress}</span>
            
          </div>,
          <hr key="1"/>,
          <FormGroup>
          <Col componentClass={ControlLabel} sm={2}>Availaible cadres</Col>
          <Col sm={10}>
              <Row>
                
                  <Col sm={10}>
                      {/*<div style={{ overflowY: "scroll", minHeight: 250, maxHeight: 250 }}>*/}
                      <div style={{ overflowY: "scroll", minHeight: 250, maxHeight: 250 }}>
                          <Table striped hover>
                              <thead>
                                  <tr>
                                      <th style={{ width: "20%" }}>Id</th>
                                      <th style={{ width: "80%" }}>Name</th>
                                      
                                  </tr>
                              </thead>
                              <tbody>
                                  {Object.keys(this.state.cadres).map(id =>
                                      <tr>
                                          <td>
                                              <h6>{this.state.cadres[id].id}</h6>
                                          </td>
                                          <td>
                                              <h6>{this.state.cadres[id].name}</h6>
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