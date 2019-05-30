import * as React from 'react';
import {withRouter,NavLink } from 'react-router-dom'
import {NavItem, Nav} from 'react-bootstrap';


import Cookies from 'js-cookie';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FaCogs, FaTachometerAlt, FaPlay, FaDatabase } from 'react-icons/fa';

const Menu = (props) => {
    return(
        <div>
            {/*<div className="app-name">
                <span>Workforce Pressure Calculator</span>
            </div>*/}
            {/*!this.state.isLogin && */}
            <Nav bsStyle="tabs" activekey="1">

                <NavLink className="sign-out" to="/login"> Sign out ({props.username})</NavLink>

                <NavItem className="link-wrapper" componentClass='span'><NavLink activeClassName="active" to="/home"><FaTachometerAlt /> Dashboard</NavLink></NavItem>
                <NavItem className="link-wrapper" componentClass='span'><NavLink activeClassName="active" to="/start"><FaPlay /> Start</NavLink></NavItem>
                <NavItem className="link-wrapper" componentClass='span'><NavLink activeClassName="active" to="/metadata"><FaDatabase /> Metadata</NavLink></NavItem>

                <NavItem className="link-wrapper" componentClass='span'>
                    <NavLink activeClassName="active" to="/config">
                        <span className="glyphicon glyphicon-cog" aria-hidden="true"><FaCogs /> Config</span>
                    </NavLink>
                </NavItem>
            </Nav>
        </div>
    )

}
export default withRouter(Menu);