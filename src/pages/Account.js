import React from 'react';

import AuthUserContext from 'components/AuthUserContext';
import PasswordChangeForm from 'components/PasswordChange';
import withAuthorization from 'components/withAuthorization';

const Account = () =>
    <AuthUserContext.Consumer>
        {authUser =>
            <div>
                <h1>이메일: {authUser.email}</h1>
                <PasswordChangeForm />
            </div>
        }
    </AuthUserContext.Consumer>

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(Account);