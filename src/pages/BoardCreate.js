import React, { Component } from 'react';
import * as routes from '../constants/routes';
import { Link } from 'react-router-dom';
import { auth, db, storage } from '../firebase';
import withAuthorization from 'components/withAuthorization';
import ImageUpload from 'components/ImageUpload';
import StarRating from 'components/StarRating';
import { WithContext as ReactTags } from 'react-tag-input';
import styles from 'shared/Common.module.css';
import styles from 'shared/Board.module.css';

const KeyCodes = {
    enter: 13,
    space: 32,
};

const delimiters = [KeyCodes.space, KeyCodes.enter];

const BoardCreate = ({ history }) =>
    <div className={styles.boardBackWrap}>
        <div className={styles.layerTop}>
            <Link className={styles.backBtn} to={routes.HOME}>뒤로가기</Link>
        </div>
        <div className={styles.boardBoxWrap}>
            <div className={styles.detailInfoWrap}>
                <BoardCreateForm history={history} />
            </div>
        </div>
    </div>

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
    author: '',
    nickname: '',
    title: '',
    description: '',
    rating: 0,
    tags: [],
    image: '',
    imageName: '',
    startedAt: new Date(),
    dateWithFormat: getToday(),
    error: null,
};

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

class BoardCreateForm extends Component {

    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
        this._updateName = this._updateName.bind(this);
        this._updateImage = this._updateImage.bind(this);
        this._handleDelete = this._handleDelete.bind(this);
        this._handleAddition = this._handleAddition.bind(this);
    }

    componentDidMount() {
        const _this = this;
        const loginUserEmail = auth.currentUserCheck();
        db.onceGetUsernickname(loginUserEmail).then(snapshot => {
            snapshot.forEach(function(childSnapshot) {
                const childData = childSnapshot.val();
                const nickname = childData.nickname;

                _this.setState({
                    author: loginUserEmail,
                    nickname: nickname,
                });
            });
        });
    }

    _updateName(name) {
        name = Date.now() + "_" + name;
        this.setState({
            imageName: name,
        });
    }

    _updateImage(image) {
        this.setState({
            image: image,
        });
    }

    //태그 삭제 이벤트
    _handleDelete(i) {
        const { tags } = this.state;
        this.setState({
            tags: tags.filter((tag, index) => index !== i),
        });
    }

    //태그 입력 이벤트
    _handleAddition(tag) {
        if(this.state.tags.length > 4) {
          alert("태그는 5개 이상 입력할 수 없습니다.");
          return false;
        }
        this.setState(state => ({ tags: [...state.tags, tag] }));
    }

    //별점 입력 이벤트
    _onStarClickHalfStar(nextValue, prevValue, name, e) {
        const xPos = (e.pageX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.offsetWidth;
        if (xPos <= 0.5) {
            nextValue -= 0.5;
        }
        this.setState({rating: nextValue});
    }

    _onSubmit = (event) => {
        const {
            author,
            nickname,
            title,
            description,
            rating,
            tags,
            image,
            imageName,
            startedAt,
            dateWithFormat,
        } = this.state;

        const {
            history,
        } = this.props;

        //태그 array로 변환
        let tagArr = [];
        for (let i in tags) tagArr.push(tags[i].text);

        //textarea 개행 넣기
        let descriptionWithBr = description.replace(/(?:\r\n|\r|\n)/g, '<br/>');

        const _this = this;

        //storage에 이미지 업로드
        storage.uploadImage(image, imageName).on('state_changed', snapshot => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            document.getElementById('loaderWrap').style.display = "flex";
        }, function(error) {
            console.log(error);
        }, function() {
            db.doCreateBoard(author, nickname, title, descriptionWithBr, rating, tagArr, imageName, startedAt, dateWithFormat)
                .then(() => {
                    _this.setState({ ...INITIAL_STATE });
                    history.push(routes.HOME);
                })
                .catch(error => {
                    _this.setState(byPropKey('error', error));
                });
            document.getElementById('loaderWrap').style.display = "none";
        });

        event.preventDefault();
    }

    render() {
        const {
            title,
            description,
            rating,
            tags,
            image,
            error,
        } = this.state;

        const isInvalid =
            title === '' ||
            description === '' ||
            rating === '' ||
            tags.length < 1 ||
            image === '';

        return (
            <form className={styles.uploadWrap} onSubmit={this._onSubmit}>
                <ImageUpload updateName={this._updateName}
                         updateImage={this._updateImage}
                />
                <div className={styles.rightText}>
                    <h3>
                        <input
                            type="text"
                            onChange={event => this.setState(byPropKey('title', event.target.value))}
                            name="title"
                            value={title}
                            placeholder="Title"
                            id="title"
                        />
                    </h3>
                    <StarRating
                        name="rating"
                        starColor="#fcd111"
                        emptyStarColor="#fcd111"
                        value={this.state.rating}
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
                <div className={styles.bottomText}>
                    <textarea
                        onChange={event => this.setState(byPropKey('description', event.target.value))}
                        placeholder="먹어본 느낌을 상세히 적어주세요."
                        cols="80"
                        rows="3"
                        value={description}
                    >{description}</textarea>
                    <div className={styles.tagWrap}>
                        <ReactTags
                            tags={tags}
                            delimiters={delimiters}
                            handleDelete={this._handleDelete}
                            handleAddition={this._handleAddition}
                            autofocus="false"
                        />
                        <p>태그는 '스페이스바' 또는 '엔터'를 사용해 5개까지 입력이 가능합니다.</p>
                    </div>
                </div>
                <div className={styles.btnWrap}>
                    <button className={styles.submitBtn} disabled={isInvalid} type="submit">Submit</button>
                </div>
                { error && <p>{error.message}</p> }
            </form>
        );
    }
}

// export default BoardCreate;

const authCondition = (authUser) => !!authUser;
export default withAuthorization(authCondition)(BoardCreate);
// export {BoardCreateForm};
