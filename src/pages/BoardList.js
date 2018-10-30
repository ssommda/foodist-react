import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { withRouter } from 'react-router-dom';
import StarRating from 'components/StarRating';
import BoardImage from 'components/BoardImage';
import SearchByTag from 'components/SearchByTag';
import styles from 'shared/Board.module.css';

class BoardList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            boards: null,
        };
        this._updateList = this._updateList.bind(this);
    }

    componentWillMount() {
        db.onceGetBoards().then(snapshot =>
            this.setState({
                boards: snapshot.val()
            })
        );
    }

    _updateList(searchTag) {
        db.onceGetSearchByTag(searchTag).then(snapshot => {
            this.setState({
                boards: snapshot.val()
            })
        });

        this.props.history.push({
            pathname: '/',
            search: `?tag=${searchTag}`
        })
    }

    render() {
        const {boards} = this.state;

        return (
            <div>
                <SearchByTag sendTag={this._updateList} />
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
                    starColor="#fcd111"
                    emptyStarColor="#fcd111"
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
                </div>
                <div className={styles.tagWrap}>
                    {Object.keys(boards[key].tags).map((tag, index) =>
                        <span key={index}># {tag}</span>
                    )}
                </div>
            </Link>
        </li>
    )
export default withRouter(BoardList);
