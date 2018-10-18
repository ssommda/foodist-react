import React from 'react';
import { Link } from 'react-router-dom';

import AuthUserContext from './AuthUserContext';
import SignOutButton from './SignOut';
import * as routes from '../constants/routes';
import styles from 'shared/App.module.css';


const Navigation = () =>
    <AuthUserContext.Consumer>
        {authUser => authUser
            ? <NavigationAuth />
            : <NavigationNonAuth />
        }
    </AuthUserContext.Consumer>

const NavigationAuth = () =>
    <ul className={styles.navMenu}>
        <li className={styles.menuButton}><Link to={routes.HOME}>Home</Link></li>
        <li className={styles.menuButton}><Link to={routes.ACCOUNT}>Account</Link></li>
        <li className={styles.menuButton}><SignOutButton /></li>
    </ul>

const NavigationNonAuth = () =>
    <ul>
        {/*<li className={styles.menuButton}><Link to={routes.SIGN_IN}>Sign In</Link></li>*/}
        {/*<li className={styles.menuButton}><Link to={routes.SIGN_UP}>Sign Up</Link></li>*/}
    </ul>

export default Navigation;