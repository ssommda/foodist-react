import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Home, SignUp, SignIn, PasswordForget, Account, BoardList, BoardCreate, BoardDetail } from 'pages';
import Logo from "components/Logo";
import Navigation from 'components/Navigation';
import withAuthentication from 'components/withAuthentication';

import * as routes from '../constants/routes';
import { firebase } from '../firebase';
import classNames from 'classnames/bind';
import styles from './Common.module.css';
const cx = classNames.bind(styles);

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authUser: null,
            showMenu: false,
        };

        this._toggleMenu = this._toggleMenu.bind(this);
    }

    componentDidMount() {
        firebase.auth.onAuthStateChanged(authUser => {
            authUser
                ? this.setState({ authUser })
                : this.setState({ authUser: null });
        });
    }

    _toggleMenu() {
        this.setState({ showMenu : !this.state.showMenu});
    }

    _handleChildClick(e) {
        e.stopPropagation();
    }


    render() {

        return (
            <div className={styles.wrap}>
                <div id="loaderWrap">
                    <ul id="loader">
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>
                <Logo></Logo>
                <button className={styles.btnMenu} type="button" onClick={this._toggleMenu}>메뉴</button>
                <div className={cx('dim',{
                    active: this.state.showMenu
                })} onClick={this._toggleMenu}>
                    <div className={styles.navWrap}>
                        <Logo></Logo>
                        <Navigation authUser={this.state.authUser} />
                        {/*<button className={styles.btnClose} type="button" onClick={this._toggleMenu}>닫기</button>*/}
                    </div>
                </div>
                <div className={styles.bodyWithLeft}>
                    <Route exact path={routes.HOME} component={Home}/>
                </div>
                <div className={styles.body}>
                    <Route path={routes.BOARD_CREATE} component={BoardCreate}/>
                    <Route path='/board-detail/:id' component={BoardDetail}/>
                    <Route path={routes.SIGN_IN} component={SignIn}/>
                    <Route path={routes.SIGN_UP} component={SignUp}/>
                    <Route path={routes.ACCOUNT} component={Account}/>
                    <Route path={routes.PASSWORD_FORGET} component={PasswordForget}/>
                    <Route path={routes.BOARD_LIST} component={BoardList}/>
                </div>
            </div>
        );
    }
}

export default withAuthentication(App);
