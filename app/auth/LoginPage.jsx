import React from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import * as axios from 'axios';
import Cookies from 'js-cookie';
import {FaCheck} from 'react-icons/fa';
import  { Redirect,withRouter } from 'react-router-dom'

class LoginPage extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      login: "",
      password: "",
      isError: false,
      isRefreshed: false,
    }
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    Cookies.remove('user');
    Cookies.remove('token');
  }

  validateForm() {
    return this.state.login.length > 0 && this.state.password.length > 0;
  }
  onSubmit(event) {

    event.preventDefault();

    let login = this.state.login;

    let password = this.state.password;

    let data = {

      login: login,

      password: password
    }
    axios.post(`/auth/login`, data).then(res => {

      if (res.data == "OK") {

        Cookies.set('user', login, { expires: 1 });

        this.props.history.push(`/home`);
        //return <Redirect to='/home'  />
      } else {
        this.setState({
          isError: true
        });
      }

    }).catch(err => console.log(err));
  }

  render() {
    return (
      <div className="Login">
        {/*<form onSubmit={this.handleSubmit}>*/}

        <form onSubmit={this.onSubmit}>
          <h3>Login</h3>
          {
            this.state.isError &&
            <p className="error">Login ou mot de passe incorrect</p>
          }
          <FormControl type="text" placeholder="login" value={this.state.login}
            onChange={e => this.setState({ login: e.target.value })} />
          <br />
          <FormControl type="password" placeholder="password" value={this.state.password}
            onChange={e => this.setState({ password: e.target.value })} />
          <br />
          {/*<button>Login</button>*/}
          <div>
            <span>
              <button className="button" disabled={!this.validateForm()}><FaCheck />Login</button>
            </span>
          </div>
        </form>
      </div>
    );
  }
}
export default withRouter(LoginPage)