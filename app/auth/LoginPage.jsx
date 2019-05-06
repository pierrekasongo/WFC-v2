import  React from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import * as axios from 'axios';
import cookie from 'react-cookies';
import HomePage from '../user/HomePage';
import { Redirect } from 'react-router-dom';


export default class LoginPage extends React.Component {

    constructor(props) {

      super(props);
  
      this.state =  { 
        userId: "",
        username:"",
        countryId:""
        //countryId:cookie.load('countryId'),
      }
      this.onLogin=this.onLogin.bind(this);

      this.onLogout=this.onLogout.bind(this);
    }
    componentWillMount() {
     
    }

    onLogin(userId,countryId,username) {
      
      cookie.save('userId', userId, { path: '/' });

      cookie.save('countryId', countryId, { path: '/' });

      cookie.save('username', username, { path: '/' });

      this.setState({
         userId:userId,
         username:username,
         countryId:countryId
      })
  
    }
   
    onLogout() {
      console.log("Log out clicked!!")
      cookie.remove('userId','countryId','username', { path: '/' });
    }

    validateForm() {
      return this.state.login.length > 0 && this.state.password.length > 0;
    }
  
    handleChange() {
      this.setState({
        //[event.target.id]: event.target.value
      });
    }
  
    handleSubmit() {
        
        //console.log("Login: "+this.state.login+" Password: "+this.state.password);

        let login=this.state.login;

        let password=this.state.password;

        let data={

            login:login,

            password:password
        }
        axios.post(`/auth/login/`,data).then(res => {

            let userId=res.data['id'];
            let username=res.data['name'];
            let countryId=res.data['country_id'];
            this.onLogin(userId,countryId,username);

            //this.setState({ treatments_cadres: treatments_cadres });

        }).catch(err => console.log(err));
        
    }
  
    renderLogin() {
        return (
          <div className="Login">
            {/*<form onSubmit={this.handleSubmit}>*/}

              <FormGroup controlId="login" bsSize="large">
                <ControlLabel>Login</ControlLabel>
                <FormControl type="text" value={this.state.login} 
                onChange={e => this.setState({login:e.target.value})}/>
              </FormGroup>

              <FormGroup controlId="password" bsSize="large">
                <ControlLabel>Password</ControlLabel>
                <FormControl type="password" value={this.state.password} 
                onChange={e => this.setState({password:e.target.value})}/>
              </FormGroup>

              <Button block  bsSize="large" disabled={!this.validateForm()} type="submit" onClick={() => this.handleSubmit()}>
                Login
              </Button>
            {/*</form>*/}
          </div>
        );
    }

    render(){
      const { userId } = this.state.userId;
 
      if (!userId) {
        return (
            this.renderLogin()
        );
      }
      //return <HomePage userId={userId} />
      return <Redirect to='/home' />
    }
  }