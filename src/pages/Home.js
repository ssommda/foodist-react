import React, { Component } from 'react';
import withAuthorization from 'components/withAuthorization';
import BoardList from 'pages/BoardList';

class HomePage extends Component {

    render() {

        return (
            <div>
                <BoardList />
            </div>
        );
    }
}

const authCondition = (authUser) => !!authUser;
export default withAuthorization(authCondition, HomePage);
