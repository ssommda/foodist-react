import React, { Component } from 'react';
import {Link} from 'react-router-dom';
// import styles from 'shared/Board.module.css';
import { db, storage } from '../firebase';
import * as routes from '../constants/routes';
import ImageUpload from 'components/ImageUpload';

const BoardCreate = ({ history }) =>
    <div>
        <h3>글작성하기</h3>
        <div>
            <BoardCreateForm history={history} />
        </div>
        <Link to={routes.HOME}>목록으로</Link>
    </div>

const INITIAL_STATE = {
    title: '',
    description: '',
    rating: '',
    tags: '',
    image: '',
    imageName: '',
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
    }

    _updateName(name) {
        this.setState({
            imageName: name,
        });
    }

    _updateImage(image) {
        this.setState({
            image: image,
        });
    }

    onSubmit = (event) => {
        const {
            title,
            description,
            rating,
            tags,
            image,
            imageName
        } = this.state;

        const {
            history,
        } = this.props;

        storage.uploadImage(image, imageName).on('state_changed', snapshot => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            }, function(error) {
                console.log(error);
            }, function() {
                console.log("성공")
            });

        db.doCreateBoard(title, description, rating, tags, imageName)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                // history.push(routes.HOME);
            })
            .catch(error => {
                this.setState(byPropKey('error', error));
            });

        event.preventDefault();

    }


    render() {
        const {
            title,
            description,
            rating,
            tags,
            error,
        } = this.state;

        // const isInvalid =
        //     title === '' ||
        //     author === '' ||
        //     rating === '' ||
        //     tags === '';

        return (
            <form>
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
                    <input
                        type="text"
                        onChange={event => this.setState(byPropKey('rating', event.target.value))}
                        value={rating}
                        placeholder="Rating"
                    />
                </div>
                <div>
                    <label>tags:</label>
                    <input
                        type="text"
                        onChange={event => this.setState(byPropKey('tags', event.target.value))}
                        value={tags}
                        placeholder="tags" />
                </div>
                <ImageUpload updateName={this._updateName}
                             updateImage={this._updateImage} />
                <button type="submit" onClick={this.onSubmit}>Submit</button>

                { error && <p>{error.message}</p> }
            </form>
        );
    }
}

export default BoardCreate;
export {BoardCreateForm};