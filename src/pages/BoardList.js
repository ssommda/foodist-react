import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { db, storage } from '../firebase';
import styles from 'shared/Board.module.css';

const BoardImage = (props) => {
    const imageUrl = props.url,
        imageID = props.name,
        img = <img className={styles.hidden} id={imageID} alt="이미지" />;

    storage.getImageUrl(imageUrl, imageID);
    return img
}

class BoardList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            boards: null,
        };
    }

    componentDidMount() {
        db.onceGetBoards().then(snapshot =>
            this.setState({
                boards: snapshot.val()
            })
        );
    }


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
            <Link to={`/BoardDetail/${boards.key}`}>
                <h3>{boards[key].title}</h3>
                <p className={styles.author}>{boards[key].author}</p>
                <p className={styles.rating}>{boards[key].rating}</p>
                <p className={styles.description}>{boards[key].description}</p>
                <div>
                    {boards[key].tags.map((tag, index) =>
                        <span key={index}># {tag}</span>
                    )}
                </div>
                <div className={styles.imgWrap}>
                    <BoardImage url={boards[key].imageName} name={index + key} />
                </div>
            </Link>
        </li>
    )
export default BoardList;
