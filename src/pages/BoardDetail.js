import React, { Component } from 'react';
import * as routes from '../constants/routes';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import StarRating from 'components/StarRating';
import BoardImage from 'components/BoardImage';
import styles from 'shared/Board.module.css';

// const BoardImage = (props) => {
//     const imageUrl = props.url,
//         imageID = props.name,
//         img = <span id={imageID}></span>;
//     storage.getImageUrl(imageUrl, imageID);
//     return img;
// }

class BoardDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            detail: {},
            key: '',
            error: ''
        };
    }

    componentWillMount() {
        const {id} = this.props.match.params;
        const _this = this;

        if (!id) return;

        db.onceGetBoardDetail(id).then(snapshot =>
            _this.setState({
                detail: snapshot.val()
            })
        )
    }

    // delete(id){
    //   firebase.firestore().collection('boards').doc(id).delete().then(() => {
    //     console.log("Document successfully deleted!");
    //     this.props.history.push("/")
    //   }).catch((error) => {
    //     console.error("Error removing document: ", error);
    //   });
    // }

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

        return (
            <div className={styles.boardDetailWrap}>
                <Link to={routes.HOME}>목록으로</Link>
                <div>
                    <BoardImage url={imageName} name={imageName} />
                    {/*{imageName &&*/}
                        {/*<BoardImage url={imageName} name={imageName} />*/}
                    {/*}*/}
                </div>
                <h3>{title}</h3>
                <div>
                    <h4>설명</h4>
                    <p>{description}</p>
                </div>
                <div>
                    <h4>닉네임</h4>
                    <p>{nickname}</p>
                </div>
                <StarRating
                name="rating"
                editing={false}
                starColor="#ffb400"
                emptyStarColor="#ffb400"
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
                <div>
                    <p>{tags}</p>
                    <p>{dateWithFormat}</p>
                </div>
                {/*<Link to={`/edit/${this.state.key}`} class="btn btn-success">Edit</Link>&nbsp;*/}
                {/*<button onClick={this.delete.bind(this, this.state.key)} class="btn btn-danger">Delete</button>*/}
            </div>
        );
    }
}

export default BoardDetail;
