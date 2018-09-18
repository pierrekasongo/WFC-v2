import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, Redirect, Switch, Link } from 'react-router-dom'
import { Grid, NavItem, Nav } from 'react-bootstrap';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api';

import AdminPage from './admin/AdminPage';
import UserPage from './user/UserPage';
import ImportPage from './import/ImportPage';

class App extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <Grid>
                    <Nav bsStyle="tabs" activekey="1">
                        <NavItem className="link-wrapper" componentClass='span'><Link to="/user">Users</Link>|</NavItem>
                        <NavItem> </NavItem>
                        <NavItem className="link-wrapper" componentClass='span'><Link to="/admin">Admin</Link>|</NavItem>
                        <NavItem className="link-wrapper" componentClass='span'><Link to="/import">Data import</Link></NavItem>
                    </Nav>
                    <br />
                    <Switch>
                        <Route path='/user' component={UserPage} />
                        <Route path='/admin' component={AdminPage} />
                        <Route path='/import' component={ImportPage} />
                        <Redirect to='/user' />
                    </Switch>
                </Grid>
            </BrowserRouter>
        );
    }

}

ReactDOM.render(<App />, document.getElementById("app"));