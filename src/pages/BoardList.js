import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { db } from '../firebase';
import StarRating from 'components/StarRating';
import BoardImage from 'components/BoardImage';
import SearchByTag from 'components/SearchByTag';
import styles from 'shared/Board.module.css';
import queryString from 'query-string';

const incrementPageNum = 12;
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

        let boardArr = [];

        if(!tagValue){

            //리스트 갯수
            db.boardRef.get().then(querySnapshot =>
                totalPageNum = Math.ceil(querySnapshot.size/incrementPageNum)
            );

            //리스트 data
            db.boardRef
                .orderBy("dateWithFormat", "desc")
                .limit(listNum)
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach((doc) => {
                        let boardData = doc.data();
                        boardData.id = doc.id;
                        boardArr.push(boardData);
                        _this.setState({
                            boards: boardArr,
                        });
                        sending = false;
                    });
                })
                .catch(function(error) {
                    console.log("Error getting documents: ", error);
                });

            // var boardRef = db.boardRef
            //     .orderBy("dateWithFormat", "desc")
            //     .limit(listNum);
            //
            // return boardRef.get().then(function (documentSnapshots) {
            //     // Get the last visible document
            //     var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
            //     // console.log("last", lastVisible);
            //
            //     documentSnapshots.forEach((doc) => {
            //         let boardData = doc.data();
            //         boardData.id = doc.id;
            //         boardArr.push(boardData);
            //         _this.setState({
            //             boards: boardArr,
            //         });
            //         sending = false;
            //     });
            //
            //     boardRef = db.boardRef
            //         .orderBy("dateWithFormat", "desc")
            //         .startAfter(lastVisible)
            //         .limit(listNum);
            // });


        } else {

            //리스트 갯수
            db.boardRef.where("tags." + tagValue, "==", true)
                .get()
                .then(querySnapshot =>
                totalPageNum = Math.ceil(querySnapshot.size/incrementPageNum)
            );

            //리스트 data
            db.boardRef.where("tags." + tagValue, "==", true)
                .limit(listNum)
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach((doc) => {
                        let boardData = doc.data();
                        boardData.id = doc.id;
                        boardArr.push(boardData);
                        _this.setState({
                            boards: boardArr,
                        });
                        sending = false;
                    });
                })
                .catch(function(error) {
                    console.log("Error getting documents: ", error);
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
            <Link to={`/board-detail/${boards[key].id}`}>
                <div className={styles.imgWrap}>
                    <BoardImage url={boards[key].imageName} name={boards[key].id + index} />
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
                        <span key={index}># {decodeURIComponent(tag)}</span>
                    )}
                </div>
            </Link>
        </li>
    );
export default withRouter(BoardList);
