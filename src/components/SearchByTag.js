import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styles from 'shared/Board.module.css';

class SearchByTag extends Component {

    constructor(props){
        super(props);
        this.state = {
            searchTag : ''
        }
    }

    //검색어 입력
    _onChange = (event) => {
        const inputValue = event.target.value;

        //특수문자 포함 체크
        const regx = /[[\]\\/?.,;:|)*~`!^\-_+<>@#$%&=('"]/gi;
        if(regx.test(inputValue)) {
            alert("특수문자를 포함한 태그는 입력할 수 없습니다.");
            event.target.value = '';
        }

        this.setState({searchTag : inputValue});
    };

    //검색어 전송
    _onSubmit = () => {
        const tag = this.state.searchTag;
        this.props.sendTag(tag)
    };

    //input에서 enter키 감지, event trigger
    _onEnter = (event) => {
        if (event.keyCode === 13) {
            this._onSubmit();
        }
    };


    render() {
        return (
            <div className={styles.listFixWrap} id="searchTagInput">
                <div className={styles.listSearchWrap}>
                    <input
                        type="text"
                        name="searchByTag"
                        placeholder="검색하고 싶은 태그를 입력해주세요."
                        onChange={this._onChange}
                        onKeyDown={this._onEnter}
                    />
                    <button onClick={this._onSubmit}>Search</button>
                </div>
            </div>
        )

    }
}

export default withRouter(SearchByTag);