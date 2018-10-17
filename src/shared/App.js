import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Home, SignUp, SignIn, PasswordForget, Account } from 'pages';
import Logo from "components/Logo";
import Navigation from 'components/Navigation';
// import SignOutButton from 'components/SignOut';
import withAuthentication from 'components/withAuthentication';

import * as routes from '../constants/routes';
import { firebase } from '../firebase';

import styled from 'styled-components';
import styles from 'shared/App.css';

const SearchWrap = styled.div`
    margin: 0; 
    padding: 0;
`;


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
                        <SearchWrap>
                            <input type="text"/>
                            <button>검색</button>
                        </SearchWrap>
                        <Navigation authUser={this.state.authUser} />
                    </header>
                </div>
                <div className={styles.body}>
                    <Route exact path={routes.HOME} component={Home}/>
                    <Route path={routes.SIGN_IN} component={SignIn}/>
                    <Route path={routes.SIGN_UP} component={SignUp}/>
                    <Route path={routes.ACCOUNT} component={Account}/>
                    <Route path={routes.PASSWORD_FORGET} component={PasswordForget}/>
                </div>
            </div>
        );
    }
}

export default withAuthentication(App);