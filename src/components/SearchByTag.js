import React, { Component } from 'react';
// import styles from 'shared/Common.module.css';
// import styles from 'shared/Board.module.css';


class SearchByTag extends Component {

    constructor(props){
        super(props);
        this.state = {
            searhTag = ''
        }
    }

    //댓글 작성
    _onSubmit = (event) => {
        const tag = this.state.searchTag;
        const _this = this;

        db.onceGetSearchByTag(tag).then(snapshot => {
            _this.props.sendTagData(snapshot.val());
        });

        event.preventDefault();
    }

    render() {

        return (
            <div>
                <form role="search">
                    <input
                        type="search"
                        name="searchByTag"
                        placeholder="검색하고 싶은 태그를 입력해주세요."
                        onChange={this.setState({searchTag : event.target.value})}
                    />
                    <button onClick={this._onSubmit}>Search</button>
                </form>
            </div>
        )

    }

}

export default SearchByTag;
