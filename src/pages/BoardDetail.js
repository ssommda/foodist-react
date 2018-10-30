import React, { Component } from 'react';
import * as routes from '../constants/routes';
import { Link } from 'react-router-dom';
import { auth, db, storage } from '../firebase';
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
            _this.setState({
                detail: snapshot.val(),
                // key: id,
            })
        )
    }

    componentDidMount() {
        //로그인 유저에 따라 게시글 권한 변경
        const loginUserEmail = auth.currentUserCheck();
        const _this = this;
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
        const boardKey = this.state.key.id;
        const imageName = this.state.detail.imageName;

        if (!boardKey) return;

        const deleteAllBoardData = () => {
            //디비에서 게시글 삭제
            db.onceRemoveBoard(boardKey).then(() => {
                console.log("successfully deleted!");
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });

            //디비에서 해당 게시물의 코멘트 삭제
            db.onceRemoveComments(boardKey).then(() => {
                console.log("successfully deleted!");
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });

            //스토리지에서 해당 게시물의 이미지 삭제
            storage.getImageUrl(imageName).delete().then(function() {
              // File deleted successfully
            }).catch(function(error) {
              // Uh-oh, an error occurred!
            });
        }

        //삭제 process 완료된 후 홈으로 이동
        deleteAllBoardData().then(() =>
            this.props.history.push("/");
        )
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
                    <Link className={styles.backBtn} to={routes.HOME}>뒤로가기</Link>
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

                {authorCheck &&
                    <button onClick={this._deleteBoard}>Delete</button>
                    {/*<Link to={`/edit/${this.state.key}`}>Edit</Link>*/}
                }
            </div>
        );
    }
}

const TagList = ({ tags }) =>
    Object.keys(tags).map((tag, index) =>
        <span key={index}># {tag}</span>
    );


export default BoardDetail;
