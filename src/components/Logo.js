import React from 'react';
import styled from 'styled-components';
import logo from '../logo.png';

const ProjectLogo = styled.h1`
  width: 95px;
`;

const Logo = () => {
    return (
        <ProjectLogo><img src={logo} alt=""/></ProjectLogo>
    );
};

export default Logo;