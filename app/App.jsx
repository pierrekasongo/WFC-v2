import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, Redirect, Switch, Link, NavLink } from 'react-router-dom'
import { Grid, NavItem, Nav, SplitButton, MenuItem } from 'react-bootstrap';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api';

import AdminPage from './admin/AdminPage';
import UserPage from './user/UserPage';
import ImportPage from './import/ImportPage';
import ConfigPage from './config/ConfigPage';
import HomePage from './user/HomePage';
import StatisticsPage from './admin/StatisticsPage';
import StartPage from './admin/StartPage';
import LoginPage from './auth/LoginPage';
import CadreTimePage from './user/CadreTimePage';
import MetadataPage from './admin/MetadataComponent';
//import Cookies from 'react-cookies';
import Cookies from 'js-cookie';


class App extends React.Component {

    constructor(props){

        super(props);

        this.state = {
            username:"",
            isLogin:false,
        }
    }
    
    componentWillMount(){

        let path=window.location.pathname;

        if(path === '/login'){
            this.setState({
                isLogin:true
            })
        }

        let username=Cookies.get('user');

        if(typeof(username) !== 'undefined'){

            if(username.length >  0){

                this.setState({
                    isLoggedin:true,
                    username:username,
                })
            }
        }
    }

    render() {
        return (
            <BrowserRouter>
                
                    <Grid>
                        <div className="app-name">
                            <span>Workforce Pressure Calculator</span>
                        </div>
                        {
                            !this.state.isLogin && 
                            <Nav bsStyle="tabs" activekey="1">
                                
                                <NavLink className="sign-out" to="/login"> Sign out ({this.state.username})</NavLink>
                                
                                <NavItem className="link-wrapper" componentClass='span'><NavLink activeClassName="active" to="/home">Dashboard</NavLink></NavItem>
                                <NavItem className="link-wrapper" componentClass='span'><NavLink activeClassName="active" to="/start">Start</NavLink></NavItem>
                                <NavItem className="link-wrapper" componentClass='span'><NavLink activeClassName="active" to="/metadata">Metadata</NavLink></NavItem>

                                <NavItem className="link-wrapper" componentClass='span'>
                                    <NavLink activeClassName="active" to="/config">
                                        <span class="glyphicon glyphicon-cog" aria-hidden="true">Config</span>
                                    </NavLink>
                                </NavItem>                       
                            </Nav>
                        }
                        <br/><br/>
                        <Switch>
                            <Route path='/user' component={UserPage} />
                            <Route path='/admin' component={AdminPage} />
                            <Route path='/import' component={ImportPage} />
                            <Route path='/config' component={ConfigPage} />
                            <Route path='/statistics' component={StatisticsPage} />
                            <Route path='/start' component={StartPage} />
                            <Route path='/home' component={HomePage} />
                            <Route path='/cadre-time' component={CadreTimePage} />
                            <Route path='/login' component={LoginPage} />
                            <Route path='/sign-out' component={LoginPage} />
                            <Route path='/metadata' component={MetadataPage} />
                            <Redirect to='/home' />
                        </Switch>
                        
                    </Grid>
                
            </BrowserRouter>
            
        );
    }
}
ReactDOM.render(<App />, document.getElementById("app"));