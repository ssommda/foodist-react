import React from 'react';
import { Link } from 'react-router-dom';
import * as routes from '../constants/routes';
import logo from '../images/logo.png';

const Logo = () => {
    return (
        <h1><Link to={routes.HOME}><img src={logo} alt="Foodist"/></Link></h1>
    );
};

export default Logo;