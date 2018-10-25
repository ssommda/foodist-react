import React from 'react';
import withAuthorization from './withAuthorization';
import { auth, db } from '../firebase';
import styles from 'shared/Board.module.css';


const CommentReg = () => {
    return (
        <textarea></textarea>
    );
};


const CommentListItems = () => {
    Object.keys(comments).map((key, index) =>
        <li key={key}>
            <div className={styles.textWrap}>
                <StarRating
                name="rating"
                starColor="#ffb400"
                emptyStarColor="#ffb400"
                value={comments[key].rating}
                renderStarIcon={(index, value) => {
                    return (
                        <span>
                            <i className={index <= value ? 'fas fa-star' : 'far fa-star'} />
                        </span>
                    );
                }}
                renderStarIconHalf={() => {
                    return (
                        <span>
                            <span style={{position: 'absolute'}}><i className="far fa-star" /></span>
                            <span><i className="fas fa-star-half" /></span>
                        </span>
                    );
                }}/>
            </div>
        </li>
  };

const INITIAL_STATE = {
    loginUser: '',
    nickname: '',
    contents: '',
    rating: 5.0,
    startedAt: new Date(),
    dateWithFormat: getToday(),
    error: null,
};

class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    conponentWillMount() {
        const _this = this;
        const loginUserEmail = auth.currentUserCheck();
        db.onceGetUsernickname(loginUserEmail).then(snapshot => {
            snapshot.forEach(function(childSnapshot) {
                const childData = childSnapshot.val();
                const nickname = childData.nickname;

                _this.setState({
                    nickname: nickname,
                });
            });
        });
    }

    render() {

        return (
          <div>
              <div>
                  <CommentReg />
              </div>
              <ul>
                  <CommentListItems />
              </ul>
          </div>
        );
    }


}

export default Logo;
