import React, { Component } from 'react';
import withAuthorization from './withAuthorization';
import { auth, db } from '../firebase';
import StarRating from 'components/StarRating';
import styles from 'shared/App.module.css';

const getToday = () => {
    let today = new Date();
    let yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    if(mm<10){
        mm='0'+mm;
    }
    if(dd<10){
        dd='0'+dd;
    }
    today = yyyy + "." + mm + "." + dd;
    return today
};

const INITIAL_STATE = {
    contents: '',
    rating: 0,
    startedAt: new Date(),
    dateWithFormat: getToday(),
    error: null,
};

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});


class Comment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            comments: null,
            boardKey: '',
            loginUser: '',
            nickname: '',
            ...INITIAL_STATE
        };
    }

    componentWillMount() {
        const _this = this;
        const loginUserEmail = auth.currentUserCheck();
        db.onceGetUsernickname(loginUserEmail).then(snapshot => {
            snapshot.forEach(function(childSnapshot) {
                const childData = childSnapshot.val();
                const nickname = childData.nickname;

                _this.setState({
                    loginUser: loginUserEmail,
                    nickname: nickname,
                });
            });
        });

    }

    componentDidMount(){
        const boardKey = this.props.boardKey.id;
        db.onceGetComments(boardKey).then(snapshot => {
            this.setState({
                comments: snapshot.val(),
                boardKey: boardKey,
            })
        });
    }

    //별점 입력 이벤트
    _onStarClickHalfStar(nextValue, prevValue, name, e) {
        const xPos = (e.pageX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.offsetWidth;
        if (xPos <= 0.5) {
            nextValue -= 0.5;
        }
        this.setState({rating: nextValue});
    }

    //댓글 작성
    _onSubmit = (event) => {
        const {
            nickname,
            contents,
            rating,
            startedAt,
            dateWithFormat,
        } = this.state;

        const boardKey = this.props.boardKey;

        db.doRegComment(boardKey, nickname, contents, rating, startedAt, dateWithFormat)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
            })
            .catch(error => {
                this.setState(byPropKey('error', error));
            });

        db.onceGetComments(boardKey).then(snapshot => {
            this.setState({
                comments: snapshot.val()
            })
        });

        event.preventDefault();
    }


    render() {

        const {
            comments,
            rating,
            contents,
            error,
        } = this.state;

        // const isInvalid =
        //     rating === '' ||
        //     contents === '';

        return (
            <div className={styles.commentWrap}>
                <h4>Reviews</h4>
                <div className={styles.commentRegFrom}>
                    <form>
                        <div className={styles.starRatingWrap}>
                            <StarRating
                                name="rating"
                                starColor="#fcd111"
                                emptyStarColor="#fcd111"
                                value={rating}
                                onStarClick={this._onStarClickHalfStar.bind(this)}
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
                                }}
                            />
                        </div>
                        <input
                            type="text"
                            onChange={event => this.setState(byPropKey('contents', event.target.value))}
                            placeholder="내용을 작성해주세요."
                            value={contents}
                        />
                        <a href="#a" className={styles.submitBtn} onClick={this._onSubmit}>Submit</a>
                        { error && <p>{error.message}</p> }
                    </form>
                </div>
                <ul className={styles.commentList}>
                    {!!comments && <CommentListItems comments={comments}/>}
                </ul>
            </div>
        );
    }
}

const CommentListItems = ({ comments }) =>
    Object.keys(comments).map((key, index) =>
        <li key={key}>
            <div className={styles.commentTop}>
                <strong>{comments[key].nickname}</strong>
                <StarRating
                    name="rating"
                    starColor="#fcd111"
                    emptyStarColor="#fcd111"
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
            <p className={styles.commentCon}>{comments[key].contents}</p>
            <p className={styles.commentDate}>- {comments[key].dateWithFormat}</p>
        </li>
    )

const authCondition = (authUser) => !!authUser;
export default withAuthorization(authCondition)(Comment);
