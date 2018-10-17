import React from 'react';
import { Link } from 'react-router-dom';
import * as routes from '../constants/routes';
import styled from 'styled-components';
import logo from '../logo.png';

const ProjectLogo = styled.h1`
  width: 95px;
`;

const Logo = () => {
    return (
        <ProjectLogo><Link to={routes.HOME}><img src={logo} alt=""/></Link></ProjectLogo>
    );
};

export default Logo;