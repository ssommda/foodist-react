import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import styles from 'shared/Board.module.css';
import { db, storage } from '../firebase';

const BoardImage = (imageUrl, key) => {
    const img = <img className={styles.hidden} id={key} alt="이미지" />;
    storage.getImageUrl(imageUrl, key);
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
                {!!boards && <BoardListItems boards={boards}/>}
            </div>
        );
    }
}

const BoardListItems = ({ boards }) =>
    <ul className={styles.boardList}>
        {Object.keys(boards).map(key =>
            <li key={key}>
                <Link to={`/BoardDetail/${boards.key}`}>
                    <h3>{boards[key].title}</h3>
                    <p className={styles.author}>{boards[key].author}</p>
                    <p className={styles.rating}>{boards[key].rating}</p>
                    <p className={styles.description}>{boards[key].description}</p>
                    <ul>
                        {boards[key].tags.map(function(tag){
                            return <li># {tag}</li>;
                        })}
                    </ul>
                    <div className={styles.imgWrap}>
                        <BoardImage imageUrl={boards[key].image} key={key} />
                    </div>
                </Link>
            </li>
        )}
    </ul>


// const authCondition = (authUser) => !!authUser;

// export default withAuthorization(authCondition)(HomePage);
export default BoardList;
