import React, { Component } from 'react';
import { db } from '../firebase';
// import styles from 'shared/Board.module.css';


class SearchByTag extends Component {

    constructor(props){
        super(props);
        this.state = {
            searchTag : ''
        }
    }

    //댓글 작성
    _onSubmit = (event) => {
        const tag = this.state.searchTag;
        const _this = this;

        db.onceGetSearchByTag(tag).then(snapshot => {
            _this.props.sendTagData(snapshot.val());
        });

        db.onceGetSearchByTag(tag);

        event.preventDefault();
    }

    render() {

        return (
            <div>
                <input
                    type="text"
                    name="searchByTag"
                    placeholder="검색하고 싶은 태그를 입력해주세요."
                    onChange={event => this.setState({searchTag : event.target.value})}
                />
                <button onClick={this._onSubmit}>Search</button>
            </div>
        )

    }

}

export default SearchByTag;
