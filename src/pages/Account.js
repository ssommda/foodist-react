import React, { Component } from 'react';
import { auth, db } from '../firebase';
import * as routes from '../constants/routes';
import { Link } from 'react-router-dom';
import PasswordChangeForm from 'components/PasswordChange';
import withAuthorization from 'components/withAuthorization';
import SignOutButton from 'components/SignOut';
import styles from 'shared/Member.module.css';
import logo from '../images/logo.png';

class Account extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            nickname: '',
        };
    }

    componentDidMount() {
        const _this = this;
        const loginUserEmail = auth.currentUserCheck();
        db.getUsernickname(loginUserEmail)
            .then(querySnapshot => {
                querySnapshot.forEach((doc) => {
                    const nickname = doc.data().nickname;;
                    _this.setState({
                        email: loginUserEmail,
                        nickname: nickname,
                    });
                });
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
    }

    render() {
        const {
            email,
            nickname
        } = this.state;

        return (
            <div className={styles.backWrap}>
                <div className={styles.formBoxWrap}>
                    <h1><img src={logo} alt="Foodist" /></h1>
                    <div className={styles.formWrap}>
                        <h3>{email}</h3>
                        <h2>{nickname}</h2>
                        <PasswordChangeForm />
                        <Link className={styles.subBtn} to={routes.HOME}>back</Link>
                        <p>
                            <SignOutButton />
                        </p>
                    </div>
                </div>
            </div>
        )
    }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition, Account);
