import React, { Component } from 'react';
import * as routes from '../constants/routes';
import { Link } from 'react-router-dom';
import { db } from '../firebase';

class BoardDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      key: ''
    };
  }

  componentDidMount() {
    const {id} = this.props.match.params;
    const _this = this;

    if (!id) return;

    const detail = firebase.database().ref('contactslist/' + id);

    detail.on('value', function(snapshot) {
      _this.setState({
        detail: snapshot.val()
      });
    });
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
        image,
        dateWithFormat,
        error,
    } = this.state.detail;

    return (
      <div className={styles.boardDetailWrap}>
        <Link to={routes.HOME}>목록으로</Link><
        <h3>
          {title}
        </h3>
        <div>
          <div>
              <h4>설명</h4>
              <p>{description}</p>
          </div>
          <div>
              <h4>닉네임</h4>
              <p>{author}</p>
          </div>
          <StarRatingComponent
              name="rating"
              editing={false}
              starCount={5}
              value={rating}
          />
          <div>
              <p>{tags}</p>
              <p>{dateWithFormat}</p>
          </div>
          // <Link to={`/edit/${this.state.key}`} class="btn btn-success">Edit</Link>&nbsp;
          // <button onClick={this.delete.bind(this, this.state.key)} class="btn btn-danger">Delete</button>
        </div>
      </div>
    );
  }
}

export default BoardDetail;
