import React, { Component } from 'react';
import withAuthorization from './withAuthorization';
import { auth, db } from '../firebase';
import StarRating from 'components/StarRating';
import styles from 'shared/Board.module.css';

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

        db.getUsernickname(loginUserEmail)
            .then(querySnapshot => {
                querySnapshot.forEach((doc) => {
                    const nickname = doc.data().nickname;;
                    _this.setState({
                        loginUser: loginUserEmail,
                        nickname: nickname,
                    });
                });
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });

    }

    componentDidMount(){
        const boardKey = this.props.boardKey.id;

        db.getComments(boardKey).then(querySnapshot => {
            let commentArr = [];
            querySnapshot.forEach((doc) => {
                commentArr.push(doc.data())
                this.setState({
                    comments: commentArr,
                    boardKey: boardKey
                });
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
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
            dateWithFormat,
        } = this.state;

        const boardKey = this.props.boardKey;

        db.doRegComment(boardKey, nickname, contents, rating, dateWithFormat)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
            })
            .catch(error => {
                this.setState(byPropKey('error', error));
            });

        db.getComments(boardKey).then(querySnapshot => {
            let commentArr = [];
            querySnapshot.forEach((doc) => {
                commentArr.push(doc.data());
                this.setState({
                    comments: commentArr,
                });
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });

        event.preventDefault();
    };


    render() {

        const {
            comments,
            rating,
            contents,
            error,
        } = this.state;

        const isInvalid =
            rating === 0 ||
            contents === '';

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
                        <textarea
                            type="text"
                            onChange={event => this.setState(byPropKey('contents', event.target.value))}
                            placeholder="내용을 작성해주세요."
                            cols="80"
                            rows="1"
                            value={contents}
                        >{contents}</textarea>
                        <div className={styles.submitBtnWap}>
                            <button className={styles.submitBtn} disabled={isInvalid} onClick={this._onSubmit} type="button" >Submit</button>
                            { error && <p>{error.message}</p> }
                        </div>
                    </form>
                </div>
                <ul className={styles.commentList} id="commentList">
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
            <pre className={styles.commentCon}>{comments[key].contents}</pre>
            <p className={styles.commentDate}>- {comments[key].dateWithFormat}</p>
        </li>
    )

const authCondition = (authUser) => !!authUser;
export default withAuthorization(authCondition,Comment);
