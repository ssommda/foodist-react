import React, { Component } from 'react';
import * as routes from '../constants/routes';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import styles from 'shared/Common.module.css';
import styles from 'shared/Member.module.css';
import logo from '../images/logo.png';

const PasswordForget = () =>
    <div className={styles.backWrap}>
        <div className={styles.formBoxWrap}>
            <h1><img src={logo} alt="Foodist" /></h1>
            <div className={styles.formWrap}>
                <PasswordForgetForm />
                <Link className={styles.subBtn} to={routes.SIGN_IN}>Sign In</Link>
                <p>
                    <Link to={routes.SIGN_UP}>Not a member?</Link>
                </p>
            </div>
        </div>
    </div>

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

const INITIAL_STATE = {
    email: '',
    error: null,
};

class PasswordForgetForm extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = (event) => {
        const { email } = this.state;

        auth.doPasswordReset(email)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
            })
            .catch(error => {
                this.setState(byPropKey('error', error));
            });

        event.preventDefault();
    }

    render() {
        const {
            email,
            error,
        } = this.state;

        const isInvalid = email === '';

        return (
            <form onSubmit={this.onSubmit}>
                <ul>
                    <li>
                        <input
                            value={this.state.email}
                            onChange={event => this.setState(byPropKey('email', event.target.value))}
                            type="text"
                            placeholder="Enter your e-mail"
                        />
                    </li>
                </ul>
                <button disabled={isInvalid} type="submit">
                    Reset Password
                </button>

                { error && <p>{error.message}</p> }
            </form>
        );
    }
}

const PasswordForgetLink = () =>
    <p>
        <Link to={routes.PASSWORD_FORGET}>Forgot your Password?</Link>
    </p>


export default PasswordForget;

export {
    PasswordForgetForm,
    PasswordForgetLink,
};
