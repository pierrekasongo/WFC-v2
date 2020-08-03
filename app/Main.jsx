import * as React from 'react';
import {Route,Redirect} from 'react-router-dom'
import 'react-confirm-alert/src/react-confirm-alert.css';

//import AdminPage from './admin/AdminPage';
import CalculationPage from './calculation/CalculationPage';
import TemplatePage from './template/TemplatePage';
import ConfigPage from './config/ConfigPage';
import UserPage from './auth/UserPage';
import HomePage from './admin/HomePage';
import AccountPage from './auth/AccountPage';
import StatisticsPage from './admin/StatisticsPage';
import StartPage from './admin/StartPage';
import LoginPage from './auth/LoginPage';
import MetadataPage from './admin/MetadataComponent';


const Main = () => {
    return (
        <div>
            {/*<Route path='/user' exact component={CalculationPage} />*/}
            <Route path='/template' exact component={TemplatePage} />
            <Route path='/config' exact component={ConfigPage} />
            <Route path='/users' exact component={UserPage}/>
            <Route path='/statistics' exact component={StatisticsPage} />
            <Route path='/start' exact component={StartPage} />
            <Route path='/home'exact component={HomePage} />
            <Route path='/account' exact component={AccountPage}/>
            <Route path='/metadata' exact component={MetadataPage} />
            <Route path='/' exact component={HomePage} />
            <Redirect to='/home' />
        </div>
    )
}
export default Main;