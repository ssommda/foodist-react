import React from 'react';
import { Link } from 'react-router-dom';
import * as routes from '../constants/routes';
import styles from 'shared/Common.module.css';

const Navigation = () =>
    <div>
        <ul className={styles.navMenu}>
            <li className={styles.menuButton}><Link to={routes.HOME}>Home</Link></li>
            <li className={styles.menuButton}><Link to={routes.BOARD_CREATE}>Create</Link></li>
            <li className={styles.menuButton}><Link to={routes.ACCOUNT}>Account</Link></li>
        </ul>
    </div>;

export default Navigation;
