import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from 'components/ScrollToTop';
import App from 'shared/App';

const Root = () => (
    <BrowserRouter>
        <ScrollToTop>
            <App/>
        </ScrollToTop>
    </BrowserRouter>
);

export default Root;