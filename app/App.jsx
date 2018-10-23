import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, Redirect, Switch, Link } from 'react-router-dom'
import { Grid, NavItem, Nav } from 'react-bootstrap';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api';

import AdminPage from './admin/AdminPage';
import UserPage from './user/UserPage';
import ImportPage from './import/ImportPage';
import ConfigPage from './config/ConfigPage';
import HomePage from './user/HomePage';

class App extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <Grid>
                    <div className="app-name">
                        <span>Workforce Pressure Calculator</span>
                    </div>
                    <Nav bsStyle="tabs" activekey="1">
                        <NavItem className="link-wrapper" componentClass='span'><Link to="/home">Home</Link></NavItem>
                        <NavItem className="link-wrapper" componentClass='span'><Link to="/import">Data import</Link></NavItem>
                        <NavItem className="link-wrapper" componentClass='span'><Link to="/admin">Time on task</Link></NavItem>
                        <NavItem className="link-wrapper" componentClass='span'><Link to="/user">Calculation</Link></NavItem>                        
                        <NavItem className="link-wrapper" componentClass='span'><Link to="/config">Config</Link></NavItem>
                    </Nav>
                    <br /><br />
                    <Switch>
                        <Route path='/user' component={UserPage} />
                        <Route path='/admin' component={AdminPage} />
                        <Route path='/import' component={ImportPage} />
                        <Route path='/config' component={ConfigPage} />
                        <Route path='/home' component={HomePage} />
                        <Redirect to='/home' />
                    </Switch>
                </Grid>
            </BrowserRouter>
        );
    }

}

ReactDOM.render(<App />, document.getElementById("app"));