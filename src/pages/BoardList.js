import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { db } from '../firebase';
import StarRating from 'components/StarRating';
import BoardImage from 'components/BoardImage';
import SearchByTag from 'components/SearchByTag';
import styles from 'shared/Board.module.css';
import queryString from 'query-string';

const incrementPageNum = 18;
let totalPageNum;
let sending = false;

class BoardList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            boards: null,
        };
        this._updateTag = this._updateTag.bind(this);
        this._onScroll = this._onScroll.bind(this);
    }

    componentDidMount() {

        this._updateList();

        window.addEventListener('scroll', this._onScroll);
    }

    componentDidUpdate(nextProps) {
        if (this.props !== nextProps) {
            this._updateList();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this._onScroll);
    }

    _onScroll = () => {
        //paging
        if((window.innerHeight + window.scrollY) >= (document.body.offsetHeight) && !sending){
            sending = true;
            const queryValues = queryString.parse(this.props.location.search);
            const tagValue = queryValues.tag;
            let pageNum = Number(queryValues.page);
            let newPage;

            if(!pageNum){   //초기 화면일때
                pageNum = 1;
            }

            if (pageNum !== totalPageNum) {
                newPage = pageNum + 1;  //페이지 1씩 증가
            } else {
                return false;   //전체 페이지와 같으면 증가시키지 않음
            }

            const searchQuery = { tag: tagValue, page: newPage  };
            const searchString = queryString.stringify(searchQuery);

            this.props.history.push({
                search: searchString
            })
        }
        
        //모바일 검색창 동작
        const searchTagInput = document.getElementById("searchTagInput");
        const inputOffsetTop = searchTagInput.offsetTop;
        const scroll = window.scrollY;
        if(scroll > inputOffsetTop){
            searchTagInput.classList.add("fixTop");
        } else {
            searchTagInput.classList.remove("fixTop");
        }
    };

    _updateList() {
        const queryValues = queryString.parse(this.props.location.search);
        const tagValue = queryValues.tag;
        let pageNum = Number(queryValues.page);

        const _this = this;

        if(!pageNum){
            pageNum = 1;
        }

        const listNum = pageNum * incrementPageNum;

        if(!tagValue){

            //리스트 갯수
            db.getBoardRef.once('value').then(snapshot =>
                totalPageNum = Math.ceil(snapshot.numChildren()/incrementPageNum)
            );

            //리스트 data
            db.getBoardRef.limitToFirst(listNum).once('value').then(snapshot => {
                _this.setState({
                    boards: snapshot.val()
                });
                sending = false;
            });

        } else {

            //리스트 갯수
            db.getBoardRef.orderByChild('tags/' + tagValue).equalTo(true).once('value').then(snapshot =>
                totalPageNum = Math.ceil(snapshot.numChildren()/incrementPageNum)
            );

            //리스트 data
            db.getBoardRef.orderByChild('tags/' + tagValue).equalTo(true).limitToFirst(listNum).once('value').then(snapshot => {
                _this.setState({
                    boards: snapshot.val()
                });
                sending = false;
            });
        }
    }

    _updateTag(searchTag) {
        const searchQuery = { tag: searchTag, page: incrementPageNum };
        const searchString = queryString.stringify(searchQuery);

        this.props.history.push({
            search: searchString
        })
    }

    render() {
        const {boards} = this.state;

        return (
            <div>
                <SearchByTag sendTag={this._updateTag} />
                {/*<SearchByTag />*/}
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
    );
export default withRouter(BoardList);
