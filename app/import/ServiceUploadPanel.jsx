import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button, Table } from 'react-bootstrap';
import axios from 'axios';

export default class ServiceUploadPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            progress:'',
            state:'button',
          };
      
          this.handleUpload= this.handleUpload.bind(this);
          this.uploadFromAPI=this.uploadFromAPI.bind(this);
    }

    handleUpload(ev) {

        ev.preventDefault();
    
        const data = new FormData();
        data.append('file', this.uploadInput.files[0]);

      axios.post('/dhis2/upload', data,
      {
        onUploadProgress: progressEvent => {
            var prog=(progressEvent.loaded / progressEvent.total)*100;
            var pg=(prog < 100)?prog.toFixed(2):prog.toFixed(0);
            this.setState({progress:pg});
      }})
        .then((result) => {
           this.setState({progress:result.data});
      }).catch(err=>console.log(err));
    }

    getFromDHIS2(ev){

      ev.preventDefault();

      axios.get('/dhis2/import_facilities_from_dhis2',
      {
        onUploadProgress: progressEvent => {
            var prog=(progressEvent.loaded / progressEvent.total)*100;
            var pg=(prog < 100)?prog.toFixed(2):prog.toFixed(0);
            this.setState({progress:pg});
      }}).then((result) => {
           this.setState({progress:result.data});
      }).catch(err=>console.log(err));
    }

    uploadFromAPI(ev) {

      this.setState({state:'loading'});

      setTimeout(()=>{

        axios.get('/dhis2/import_treatments_from_dhis2').then(res => {
          this.setState({state:'button'});
                                          
        }).catch(err => console.log(err));

      },400); 
    }

    renderLoading() {
      return (
          <div style={{ marginTop: 120, marginBottom: 65 }}>
              <div className="loader"></div>
          </div>
      );
    }
  
    renderBtnPanel() {
        return ([
          /*<form onSubmit={this.handleUpload}>
            <span><h4 >Load treatments from csv file here</h4></span>
            <div>
              <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
            </div>
            <br />
            <div class="btnDHIS2">
              <span>
                <button>Upload</button><span> {this.state.progress}</span>
              </span>
            </div>
          </form>,
          <hr/>,*/
          <div style={{ textAlign: "left", paddingTop: 10 }}>
              <span><h4 >Load treatments from DHIS2</h4></span>
              <Button bsStyle="warning" bsSize="small" onClick={() => this.uploadFromAPI()}>Upload from DHIS2</Button>
          </div>
        ]);
    }

    render(){
      return(
        <div>
          {this.state.state == 'button' && this.renderBtnPanel()}
          {this.state.state=='loading' && this.renderLoading()}
        </div>
      )
    }

};