import React, { Component } from 'react';

import withAuthorization from 'components/withAuthorization';
import { db } from '../firebase';

class HomePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: null,
        };
    }

    componentDidMount() {
        db.onceGetUsers().then(snapshot =>
            this.setState({ users: snapshot.val() })
        );
    }

    render() {
        const {users} = this.state;

        return (
            <div>
                {!!users && <UserList users={users}/>}
            </div>
        );
    }
}

const UserList = ({ users }) =>
    <div>
        <h2>가입자 이메일 리스트</h2>

        {Object.keys(users).map(key =>
            <div key={key}>{users[key].email}</div>
        )}
    </div>

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);