import React, { Component } from 'react';
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
        this.props.sendTag(tag)
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

