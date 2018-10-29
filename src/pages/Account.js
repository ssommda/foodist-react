import React from 'react';
import * as routes from '../constants/routes';
import { Link } from 'react-router-dom';
import AuthUserContext from 'components/AuthUserContext';
import PasswordChangeForm from 'components/PasswordChange';
import withAuthorization from 'components/withAuthorization';
import SignOutButton from 'components/SignOut';
import styles from 'shared/Member.module.css';
import logo from '../images/logo.png';

const Account = () =>
    <AuthUserContext.Consumer>
        {authUser =>
            <div className={styles.backWrap}>
                <div className={styles.formBoxWrap}>
                    <h1><img src={logo} alt="Foodist" /></h1>
                    <div className={styles.formWrap}>
                        <h1>{authUser.email}</h1>
                        <PasswordChangeForm />
                        <Link className={styles.subBtn} to={routes.HOME}>back</Link>
                        <p>
                            <SignOutButton />
                        </p>
                    </div>
                </div>
            </div>


        }
    </AuthUserContext.Consumer>

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Account);
