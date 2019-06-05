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
            <Route path='/user' exact component={UserPage} />
            <Route path='/admin' exact component={AdminPage} />
            <Route path='/import' exact component={ImportPage} />
            <Route path='/config' exact component={ConfigPage} />
            <Route path='/statistics' exact component={StatisticsPage} />
            <Route path='/start' exact component={StartPage} />
            <Route path='/home'exact component={HomePage} />
            <Route path='/cadre-time' exactcomponent={CadreTimePage} />
            {/*<Route path='/login' component={LoginPage} />
            <Route path='/sign-out' component={LoginPage} />*/}
            <Route path='/metadata' exact component={MetadataPage} />
            <Route path='/' exact component={HomePage} />
            {/*<Redirect to='/home' />*/}
        </div>
    )
}
export default Main;