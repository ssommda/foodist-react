/* 전체 App을 감싸는 곳 */

import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Home, SignUp, SignIn, PasswordForget, Account, BoardList, BoardCreate, BoardDetail } from 'pages';
import Logo from "components/Logo";
import Navigation from 'components/Navigation';
// import SignOutButton from 'components/SignOut';
import withAuthentication from 'components/withAuthentication';

import * as routes from '../constants/routes';
import { firebase } from '../firebase';
import styles from './App.module.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authUser: null,
        };
    }

    componentDidMount() {
        firebase.auth.onAuthStateChanged(authUser => {
            authUser
                ? this.setState({ authUser })
                : this.setState({ authUser: null });
        });
    }

    render() {
        return (
            <div className={styles.wrap}>
                <div>
                    <header>
                        <Logo></Logo>
                        <Navigation authUser={this.state.authUser} />
                    </header>
                </div>
                <div className={styles.body}>
                    <Route exact path={routes.HOME} component={Home}/>
                    <Route path={routes.SIGN_IN} component={SignIn}/>
                    <Route path={routes.SIGN_UP} component={SignUp}/>
                    <Route path={routes.ACCOUNT} component={Account}/>
                    <Route path={routes.PASSWORD_FORGET} component={PasswordForget}/>
                    <Route path={routes.BOARD_LIST} component={BoardList}/>
                    <Route path={routes.BOARD_CREATE} component={BoardCreate}/>
                    <Route path='/board-detail/:id' component={BoardDetail}/>
                </div>
            </div>
        );
    }
}

export default withAuthentication(App);
