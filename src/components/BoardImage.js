import React, { Component } from 'react';
import { storage } from '../firebase';

class BoardImage extends Component {

    constructor(props) {
        super(props);
    }


    componentDidMount() {
        storage.getImageUrl(this.props.url, this.props.name)
    }

    render() {

        return (
            <span id={this.props.name}></span>
        );
    }


}

export default BoardImage;