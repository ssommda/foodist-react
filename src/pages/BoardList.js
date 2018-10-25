import React, { Component } from 'react';
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


class BoardList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            boards: null,
        };
    }

    componentWillMount() {
      db.onceGetBoards().then(snapshot =>
          this.setState({
              boards: snapshot.val()
          })
      );
    }

    // componentDidMount() {
    //     db.onceGetBoards().then(snapshot =>
    //         this.setState({
    //             boards: snapshot.val()
    //         })
    //     );
    // }

    render() {
        const {boards} = this.state;

        return (
            <div>
                <ul className={styles.boardList}>
                    {!!boards && <BoardListItems boards={boards}/>}
                </ul>
            </div>
        );
    }
}

const BoardListItems = ({ boards }) =>
    Object.keys(boards).map((key, index) =>
        <li key={key}>
            <Link to={`/board-detail/${key}`}>
                <div className={styles.imgWrap}>
                    <BoardImage url={boards[key].imageName} name={index + key} />
                </div>
                <div className={styles.textWrap}>
                    <h3>{boards[key].title}</h3>
                    <p className={styles.author}>{boards[key].nickname}</p>
                    <StarRating
                    name="rating"
                    starColor="#ffb400"
                    emptyStarColor="#ffb400"
                    value={boards[key].rating}
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
                      {boards[key].tags.map((tag, index) =>
                          <span key={index}># {tag}</span>
                      )}
                  </div>
                </div>
            </Link>
        </li>
    )
export default BoardList;
