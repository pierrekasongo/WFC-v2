import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route,withRouter, Redirect, Switch, Link, NavLink } from 'react-router-dom'
import { Grid, NavItem, Nav, SplitButton, MenuItem } from 'react-bootstrap';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api';


import LoginPage from './auth/LoginPage';
import Cookies from 'js-cookie';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Menu from './Menu';
import Main from './Main';

class App extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            username: "",
            isLogin: false,
            isLoggedin: false
        }
    }

    componentWillMount() {

        let path = window.location.pathname;

        if (path === '/login') {
            this.setState({
                isLogin: true
            })
        }
        let username = Cookies.get('user');

        if (typeof (username) !== 'undefined') {

            if (username.length > 0) {

                this.setState({
                    isLoggedin: true,
                    username: username,
                })
            }
        }
    }

    render() {
        const path = window.location.pathname;
        return (
            <BrowserRouter>
                <Grid>
                    <div>
                        <Route path="/login" exact component={LoginPage} />  
                        {path !== '/login' && path !== '/sign-out' &&
                            <div>
                                <div className="app-name">
                                    <span>Workforce Pressure Calculator</span>
                                </div>

                                <Menu username={this.state.username} />
                                <br /> <br />
                                <Main />
                            </div>
                        }                        
                    </div>
                </Grid>
            </BrowserRouter>
        );
    }
}
ReactDOM.render(<App />, document.getElementById("app"));
export default withRouter(App)