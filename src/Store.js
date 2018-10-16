import React from 'react';
import PropTypes from 'prop-types';
import './Store.css';

function Store({title, image, tags, rating}){
    return(
        <div className="store_item">
            <div className="img_wrap">
                <StoreImage image={image} alt={title} />
            </div>
            <div className="text_wrap">
                <h1>{title}</h1>
                <ul className="tag_list">
                    {tags.map((tag, index) => <TagList tag={tags} key={index} />)}
                </ul>
                <div className="rating">
                    {rating}
                </div>
            </div>
        </div>
    )
}

function StoreImage({image, alt}){
    return(
        <img src={image} alt={alt} title={alt} className="store_image" />
    )
}

function TagList({tag}){
    return(
        <li># {tag}</li>
    )
}

Store.propTypes = {
    title : PropTypes.string.isRequired,
    image : PropTypes.string.isRequired,
    tags : PropTypes.array.isRequired,
    rating : PropTypes.string.isRequired
}

StoreImage.propTypes = {
    image : PropTypes.string.isRequired,
    alt : PropTypes.string.isRequired,
}

TagList.propTypes = {
    tag : PropTypes.string.isRequired
}

export default Store;