import * as React from 'react';
import { Panel, Form, FormGroup, ControlLabel, Row, FormControl, Col, Checkbox, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import InlineEdit from 'react-edit-inline2';

export default class ServiceUploadPanel extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      progress: '',
      state: 'button',
      activities: [],
      dhis2_url:'',
      dhis2_param_id:''
    };

    this.handleUpload = this.handleUpload.bind(this);
    this.uploadFromAPI = this.uploadFromAPI.bind(this);
    this.handleDhisInstance2Change = this.handleDhisInstance2Change.bind(this);

    axios.get('/user/activities')
      .then(res => this.setState({ activities: res.data }))
      .catch(err => console.log(err))

    axios.get('/configuration/configs').then(res => {
        let dhis2_url=res.data[0].value;
        let dhis2_param_id=res.data[0].id;

        this.setState({
          dhis2_url:dhis2_url,
          dhis2_param_id:dhis2_param_id,
          user_name:'',
          user_password:''
        });
      }).catch(err => console.log(err));
  }

  validateValue(text) {
    return (text.length > 0 && text.length < 64);
  }
  userNameChanged(e) {
    this.setState({user_name:e.target.value});
  }
  passwordChanged(e){
    this.setState({user_password:e.target.value})
  }
  handleDhisInstance2Change(obj) {

    const id = Object.keys(obj)[0];

    const value=Object.values(obj)[0];

    let data = {
        id:id,
        value: value,
    };
    axios.patch('/configuration/config', data).then(res => {

        console.log('Value updated successfully');
        this.setState({dhis2_url: value});

    }).catch(err => console.log(err));
  } 

  handleUpload(ev) {

    ev.preventDefault();

    const data = new FormData();
    data.append('file', this.uploadInput.files[0]);

    axios.post('/dhis2/upload', data,
      {
        onUploadProgress: progressEvent => {
          var prog = (progressEvent.loaded / progressEvent.total) * 100;
          var pg = (prog < 100) ? prog.toFixed(2) : prog.toFixed(0);
          this.setState({ progress: pg });
        }
      })
      .then((result) => {
        this.setState({ progress: result.data });
      }).catch(err => console.log(err));
  }

  uploadFromAPI(ev) {

    this.setState({ state: 'loading' });

    let data={
      dhis2_url:this.state.dhis2_url,
      user_name:this.state.user_name,
      user_password:this.state.user_password
    };

    setTimeout(() => {

      axios.post('/dhis2/import_treatments_from_dhis2',data).then(res => {
        this.setState({ state: 'button' });

      }).catch(err => console.log(err));

    }, 400);
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
      <div style={{ textAlign: "left", paddingTop: 10 }}>
        <span><h4 >Load treatments from DHIS2</h4></span>
        <div>
          <span>Dhis2 url: </span>
          <InlineEdit
              validate={this.validateValue}
              activeClassName="editing"
              text={this.state.dhis2_url}
              paramName={this.state.dhis2_param_id}
              change={this.handleDhisInstance2Change}
              style={{
                backgroundColor: '#D4E0CE',
                minWidth: 150,
                display: 'inline-block',
                margin: 0,
                padding: 0,
                fontSize: 15,
                outline: 0,
                border: 1,
                borderColor:'#59e0c5',
              }}
          />
          <span>User: </span>
          <input type="text" name="user_name" onChange={e => this.userNameChanged(e)}/>
          <span>Password: </span>
          <input type="password" name="user_password" onChange={e => this.passwordChanged(e)}/>
        </div >
        <hr/>
        <Button bsStyle="warning" bsSize="small" onClick={() => this.uploadFromAPI()}>Load from Dhis2 instance</Button>               
      </div>,
      <hr />,
      <div class="alert alert-warning" role="alert">
        {this.state.activities.length} treatments successfully imported.
      </div>
    ]);
  }

  render() {
    return (
      <div>
        {this.state.state == 'button' && this.renderBtnPanel()}
        {this.state.state == 'loading' && this.renderLoading()}
      </div>
    )
  }

};