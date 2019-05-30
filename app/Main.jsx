import * as React from 'react';
import { BrowserRouter, Route, Router, Redirect, Switch, Link, NavLink } from 'react-router-dom'


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
import 'react-confirm-alert/src/react-confirm-alert.css';

const Main = () => {
    return (
        <div>
            <Route path='/user' component={UserPage} />
            <Route path='/admin' component={AdminPage} />
            <Route path='/import' component={ImportPage} />
            <Route path='/config' component={ConfigPage} />
            <Route path='/statistics' component={StatisticsPage} />
            <Route path='/start' component={StartPage} />
            <Route path='/home' component={HomePage} />
            <Route path='/cadre-time' component={CadreTimePage} />
            {/*<Route path='/login' component={LoginPage} />
            <Route path='/sign-out' component={LoginPage} />*/}
            <Route path='/metadata' component={MetadataPage} />
            {/*<Redirect to='/home' />*/}
        </div>
    )
}
export default Main;