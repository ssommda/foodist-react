import React, { Component } from 'react';
import { storage } from '../firebase';

class BoardImage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            imageUrl: '',
        };
    }

    componentDidMount() {
        storage.getImageUrl(this.props.url).then(url =>
            this.setState({
                imageUrl: url
            })
        );
    }

    render() {
        const imgStyle = {
            backgroundImage: 'url(' + this.state.imageUrl + ')'
        };
        return <span style={imgStyle}></span>;
    }
}

export default BoardImage;
