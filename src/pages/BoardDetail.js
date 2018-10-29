import React, { Component } from 'react';
import * as routes from '../constants/routes';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import StarRating from 'components/StarRating';
import BoardImage from 'components/BoardImage';
import Comment from 'components/Comment';
import styles from 'shared/Common.module.css';
import styles from 'shared/Board.module.css';

class BoardDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            detail: {},
            key: this.props.match.params,
            error: ''
        };
    }

    componentDidMount() {
        const {id} = this.props.match.params;
        const _this = this;

        if (!id) return;

        db.onceGetBoardDetail(id).then(snapshot =>
            _this.setState({
                detail: snapshot.val(),
                key: id,
            })
        )
    }

    //게시글 삭제
    _deleteBoard() {
        const {id} = this.props.match.params;
        const _this = this;

        if (!id) return;

        db.onceRemoveBoard(id).then(() => {
            console.log("successfully deleted!");
            // this.props.history.push("/");
            history.push(routes.HOME);
        }).catch((error) => {
            console.error("Error removing document: ", error);
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
                            <p className={styles.commentCon}>{description}</p>
                            <p className={styles.commentDate}>- {dateWithFormat}</p>
                            <p className={styles.tagList}>{!!tags && <TagList tags={tags} />}</p>
                        </div>
                        <Comment boardKey={boardkey} />
                    </div>
                </div>
                {/*<Link to={`/edit/${this.state.key}`} class="btn btn-success">Edit</Link>&nbsp;*/}
                <button onClick={this._deleteBoard}>Delete</button>

            </div>
        );
    }
}

const TagList = ({ tags }) =>
    tags.map((tag, index) =>
        <span key={index}># {tag}</span>
    );


export default BoardDetail;
