import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styles from 'shared/App.module.css';
import { SignUpLink } from './SignUp';
import { PasswordForgetLink } from './PasswordForget';
import { auth } from '../firebase';
import * as routes from '../constants/routes';
import logo from '../images/logo.png';

const SignIn = ({ history }) =>
    <div className={styles.backWrap}>
        <div className={styles.formBoxWrap}>
            <h1><img src={logo} alt="Foodist" /></h1>
            <div className={styles.formWrap}>
                <SignInForm history={history} />
                <SignUpLink />
                <PasswordForgetLink />
            </div>
        </div>
    </div>

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};

class SignInForm extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = (event) => {
        const {
            email,
            password,
        } = this.state;

        const {
            history,
        } = this.props;

        auth.doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                history.push(routes.HOME);
            })
            .catch(error => {
                this.setState(byPropKey('error', error));
            });

        event.preventDefault();
    }

    render() {
        const {
            email,
            password,
            error,
        } = this.state;

        const isInvalid =
            password === '' ||
            email === '';

        return (
            <form onSubmit={this.onSubmit}>
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
                </ul>

                <button disabled={isInvalid} type="submit">
                    Sign In
                </button>

                { error && <p>{error.message}</p> }
            </form>
        );
    }
}

export default withRouter(SignIn);

export {
    SignInForm
};