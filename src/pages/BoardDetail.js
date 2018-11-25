import React, { Component } from 'react';
import * as routes from '../constants/routes';
import { Link } from 'react-router-dom';
import { auth, db, storage } from '../firebase';
import withAuthorization from 'components/withAuthorization';
import StarRating from 'components/StarRating';
import BoardImage from 'components/BoardImage';
import Comment from 'components/Comment';
import styles from 'shared/Board.module.css';

class BoardDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            detail: {},
            key: this.props.match.params,
            authorCheck: false,
            error: ''
        };
        this._deleteBoard = this._deleteBoard.bind(this);
    }

    componentWillMount() {
        const {id} = this.props.match.params;
        const _this = this;

        if (!id) return;

        //DB에서 해당 게시글 가져오기
        db.onceGetBoardDetail(id).then(snapshot =>
            this.setState({
                detail: snapshot.val(),
                key: id,
            })
        );

        //로그인 유저에 따라 게시글 권한 변경
        const loginUserEmail = auth.currentUserCheck();

        db.onceGetUsernickname(loginUserEmail).then(snapshot => {
            snapshot.forEach(function(childSnapshot) {
                const nickname = childSnapshot.val().nickname;

                if(_this.state.detail.nickname === nickname)
                    _this.setState({
                        authorCheck: true
                    });
            });
        });
    }

    //게시글 삭제
    _deleteBoard() {

        const _this = this;
        const boardKey = this.state.key;
        const imageName = this.state.detail.imageName;
        const listWrap = document.getElementById('commentList');

        if(!window.confirm("정말 삭제하시겠습니까?")) return false;

        if (!boardKey) return false;

        //디비에서 게시글 삭제
        const deleteBoard = new Promise(function (resolve, reject) {
            db.onceRemoveBoard(boardKey).then(() => {
                resolve();
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });

        });

        //스토리지에서 해당 게시물의 이미지 삭제
        const deleteImage = new Promise(function (resolve, reject) {
            storage.getImageRef(imageName).delete().then(function() {
                resolve();
            }).catch(function(error) {
                // Uh-oh, an error occurred!
            });
        });

        //디비에서 해당 게시물의 코멘트 삭제
        const deleteComment = new Promise(function (resolve, reject) {
            if (!listWrap.hasChildNodes()) {
                resolve();
            } else {
                db.onceRemoveComments(boardKey);
                resolve();
            }
        });

        //삭제 process 완료된 후 홈으로 이동
        Promise.all([deleteBoard, deleteImage, deleteComment]).then(function () {
            _this.props.history.push("/");
        });
    }

    render() {
        const {
            nickname,
            title,
            description,
            rating,
            tags,
            imageName,
            dateWithFormat,
            // error,
        } = this.state.detail;

        const boardkey = this.state.key;
        const authorCheck = this.state.authorCheck;

        return (
            <div className={styles.boardBackWrap}>
                <div className={styles.layerTop}>
                    {/*<Link className={styles.backBtn} to={routes.HOME}>Back</Link>*/}
                    <a href="javascript:history.back()" className={styles.backBtn}>Back</a>
                    {authorCheck &&
                    <button onClick={this._deleteBoard}>삭제</button>
                    }
                </div>
                <div className={styles.boardBoxWrap}>
                    <div className={styles.detailInfoWrap}>
                        <div className={styles.imgWrap}>
                            {imageName &&
                            <BoardImage url={imageName} name={imageName} />
                            }
                        </div>
                        <div className={styles.rightText}>
                            <h3>{title}</h3>
                            <p>{nickname}</p>
                            <StarRating
                                name="rating"
                                editing={false}
                                starColor="#fcd111"
                                emptyStarColor="#fcd111"
                                value={rating}
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
                        <div className={styles.bottomText}>
                            <pre className={styles.commentCon}>{description}</pre>
                            <p className={styles.commentDate}>- {dateWithFormat}</p>
                            <p className={styles.tagList}>{!!tags && <TagList tags={tags} />}</p>
                        </div>
                        <Comment boardKey={boardkey} />
                    </div>
                </div>
            </div>
        );
    }
}

const TagList = ({ tags }) =>
    Object.keys(tags).map((tag, index) =>
        <span key={index}># {tag}</span>
    );

const authCondition = (authUser) => !!authUser;
export default withAuthorization(authCondition)(BoardDetail);
