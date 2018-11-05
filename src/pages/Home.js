import React, { Component } from 'react';
// import Loadable from 'react-loadable';
import withAuthorization from 'components/withAuthorization';
import BoardList from 'pages/BoardList';

// const Loading = () => {
//     return <div>로딩중...</div>;
// };
//
// export const BoardList = Loadable({
//     loader: () => import('pages/BoardList'),
//     loading: Loading
// });

class HomePage extends Component {

    render() {

        return (
            <div>
                <BoardList />
            </div>
        );
    }
}

const authCondition = (authUser) => !!authUser
export default withAuthorization(authCondition)(HomePage);
