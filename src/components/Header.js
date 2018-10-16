import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import SignOutButton from './SignOut';

import * as routes from '../constants/routes';

import Logo from "components/Logo";

// import { NavLink } from 'react-router-dom'; //설정한 URL 이 활성화가 되면, 특정 스타일 혹은 클래스를 지정 할 수 있습니다.
import styled from 'styled-components';
import styles from 'shared/App.css';

const SearchWrap = styled.div`
    margin: 0; 
    padding: 0;
`;

const Header = () => {

    return (
        <div>
            <header>
                <Logo></Logo>
                <SearchWrap>
                    <input type="text"/>
                    <button>검색</button>
                </SearchWrap>
                <Navigation />
            </header>
        </div>
    );
};

export default Header;