import React from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from './SignOut';
import * as routes from '../constants/routes';
import styled from 'styled-components';
import styles from 'shared/App.css';

const MenuWrap = styled.ul`
    margin: 0; 
    padding: 0;
    overflow: hidden;
`;

const Navigation = ({ authUser }) =>
    <div>
        { authUser
            ? <NavigationAuth />
            : <NavigationNonAuth />
        }
    </div>

const NavigationAuth = () =>
    <MenuWrap>
        <li className={styles.menuButton}><SignOutButton /></li>
    </MenuWrap>

const NavigationNonAuth = () =>
    <MenuWrap>
        <li className={styles.menuButton}><Link to={routes.SIGN_IN}>로그인</Link></li>
        <li className={styles.menuButton}><Link to={routes.SIGN_UP}>회원가입</Link></li>
    </MenuWrap>

export default Navigation;