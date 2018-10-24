import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';
import styles from 'shared/App.module.css';
import { auth, db } from '../firebase';
import * as routes from '../constants/routes';
import logo from '../images/logo.png';

const SignUp = ({ history }) =>
    <div className={styles.backWrap}>
        <div className={styles.formBoxWrap}>
            <h1><img src={logo} alt="Foodist" /></h1>
            <div className={styles.formWrap}>
                <SignUpForm history={history} />
                <Link className={styles.subBtn} to={routes.SIGN_IN}>Already a member?</Link>
            </div>
        </div>
    </div>

const INITIAL_STATE = {
    nickname: '',
    email: '',
    password: '',
    error: null,
};

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

class SignUpForm extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    _onSubmit = (event) => {
        const {
            nickname,
            email,
            password,
        } = this.state;

        const {
            history,
        } = this.props;

        auth.doCreateUserWithEmailAndPassword(email, password)
            .then(authUser => {
                // Create a user in your own accessible Firebase Database too
                db.doCreateUser(authUser.user.uid, nickname, email)
                    .then(() => {
                        this.setState({ ...INITIAL_STATE });
                        history.push(routes.HOME);
                    })
                    .catch(error => {
                        this.setState(byPropKey('error', error));
                    });
            })
            .catch(error => {
                this.setState(byPropKey('error', error));
            });

        event.preventDefault();

    }

    render() {
        const {
            nickname,
            email,
            password,
            error,
        } = this.state;

        const isInvalid =
            password === '' ||
            email === '' ||
            nickname === '' || nickname.length > 10;

        return (
            <form onSubmit={this._onSubmit}>
                <ul>
                    <li>
                        <input
                            value={email}
                            onChange={event => this.setState(byPropKey('email', event.target.value))}
                            type="text"
                            placeholder="Enter your e-mail"
                        />
                    </li>
                    <li>
                        <input
                            value={password}
                            onChange={event => this.setState(byPropKey('password', event.target.value))}
                            type="password"
                            placeholder="Password"
                        />
                    </li>
                    <li>
                        <input
                            value={nickname}
                            onChange={event => this.setState(byPropKey('nickname', event.target.value))}
                            type="text"
                            placeholder="Nickname"
                         />
                    </li>
                </ul>

                <button disabled={isInvalid} type="submit">
                    Sign Up
                </button>

                { error && <p>{error.message}</p> }
            </form>
        );
    }
}

const SignUpLink = () =>
    <Link className={styles.subBtn} to={routes.SIGN_UP}>Sign Up</Link>


export default withRouter(SignUp);
export {
    SignUpForm,
    SignUpLink,
};
