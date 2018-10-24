import React, { Component } from 'react';
import * as routes from '../constants/routes';
import { Link } from 'react-router-dom';
import withAuthorization from 'components/withAuthorization';
import { auth, db, storage } from '../firebase';
import ImageUpload from 'components/ImageUpload';
import StarRating from 'components/StarRating';
import { WithContext as ReactTags } from 'react-tag-input';
import styles from 'shared/Board.module.css';

const KeyCodes = {
    enter: 13,
    space: 32,
};

const delimiters = [KeyCodes.space, KeyCodes.enter];

const BoardCreate = ({ history }) =>
    <div className={styles.boardCreateWrap}>
        <h3>글작성하기</h3>
        <div>
            <BoardCreateForm history={history} />
        </div>
        <Link to={routes.HOME}>목록으로</Link>
    </div>

const getToday = () => {
  let today = new Date();
  const yyyy = today.getFullYear();
  const mm = today.getMonth() + 1;
  const dd = today.getDate();
  if(mm<10){
      mm='0'+mm;
  }
  if(dd<10){
      dd='0'+dd;
  }
  today = yyyy + "-" + mm + "-" + dd;
  return today
};


const INITIAL_STATE = {
    author: '',
    nickname: '',
    title: '',
    description: '',
    rating: 5.0,
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
        const loginUserEmail = auth.currentUserCheck();
        const loginUserNickname = db.onceGetUsernickname(loginUserId);

        this.setState({
            author: auth.currentUserCheck(),
            nickname: loginUserNickname,
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

    _handleDelete(i) {
        const { tags } = this.state;
        this.setState({
            tags: tags.filter((tag, index) => index !== i),
        });
    }

    _handleAddition(tag) {
        if(this.state.tags.length > 5) {
          alert("태그는 5개 이상 입력할 수 없습니다.");
          return false;
        }
        this.setState(state => ({ tags: [...state.tags, tag] }));
    }

    _onStarClickHalfStar(nextValue, prevValue, name, e) {
        const xPos = (e.pageX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.offsetWidth;
        if (xPos <= 0.5) {
            nextValue -= 0.5;
        }
        console.log('name: %s, nextValue: %s, prevValue: %s', name, nextValue, prevValue);
        // console.log(e);
        this.setState({rating: nextValue});
    }

    _onSubmit = (event) => {
        const {
            author,
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
        for (var i in tags) {
            tagArr.push(tags[i].text);
        }

        const promise = cb => new Promise(response => {
            // 콜백 함수 안에서 resolve 함수를 실행해야 순서가 보장됨.
            cb(response);
        });

        //storage에 이미지 업로드
        const UploadStorage = storage.uploadImage(image, imageName).on('state_changed', snapshot => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            }, function(error) {
                console.log(error);
            }, function() {
                console.log("성공")
            });

        (async () => {
            await promise(UploadStorage);
        })();

        //이미지 업로드 끝난 후, 작성 내용 DB 업로드
        db.doCreateBoard(author, nickname, title, description, rating, tagArr, imageName, startedAt, dateWithFormat)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                // setTimeout(function(){
                    console.log("완료");
                    history.push(routes.HOME);
                // }, 1000);
            })
            .catch(error => {
                this.setState(byPropKey('error', error));
            });

        event.preventDefault();
    }

    render() {
        const {
            title,
            rating,
            tags,
            image,
            error,
        } = this.state;

        const isInvalid =
            title === '' ||
            rating === '' ||
            tags === '' ||
            image === '';

        return (
            <form onSubmit={this._onSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        onChange={event => this.setState(byPropKey('title', event.target.value))}
                        name="title"
                        value={title}
                        placeholder="Title"
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        onChange={event => this.setState(byPropKey('description', event.target.value))}
                        placeholder="Description"
                        cols="80"
                        rows="3"
                        value={description}
                    >{description}</textarea>
                </div>
                <div>
                    <label>rating:</label>
                    // <input
                    //     type="text"
                    //     onChange={event => this.setState(byPropKey('rating', event.target.value))}
                    //     value={rating}
                    //     placeholder="Rating"
                    // />
                    <span>{this.state.rating}</span>
                    <StarRatingComponent
                      name="rating"
                      starColor="#ffb400"
                      emptyStarColor="#ffb400"
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
                      }} />
                </div>
                <div>
                    <ReactTags
                        tags={tags}
                        delimiters={delimiters}
                        handleDelete={this._handleDelete}
                        handleAddition={this._handleAddition}
                    />
                </div>
                <div>
                    <ImageUpload updateName={this._updateName}
                             updateImage={this._updateImage}
                    />
                </div>
                <button disabled={isInvalid} type="submit">Submit</button>

                { error && <p>{error.message}</p> }
            </form>
        );
    }
}

// export default BoardCreate;

const authCondition = (authUser) => !!authUser;
export default withAuthorization(authCondition)(BoardCreate);
// export {BoardCreateForm};
