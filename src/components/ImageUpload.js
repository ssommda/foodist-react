import React, { Component } from 'react';

class ImageUpload extends Component {
    constructor(props) {
        super(props);
        this._handleImageChange = this._handleImageChange.bind(this);
    }

    //사이즈를 줄인 이미지를 storage에 저장하기 위해 blob file로 만들기
    _dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }

    _handleImageChange() {

        var reader = new FileReader();
        var state = this;
        reader.onload = function (event) {

            var image = new Image();

            image.onload = function() {

                var canvas = document.createElement("canvas"),
                    max_size = 600,
                    width = image.width,
                    height = image.height;

                if (width > height) {
                    if (width > max_size) {
                        height *= max_size / width;
                        width = max_size;
                    }
                } else {
                    if (height > max_size) {
                        width *= max_size / height;
                        height = max_size;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                canvas.getContext("2d").drawImage(image, 0, 0, width, height);

                var url = canvas.toDataURL();
                document.getElementById("uploadPreview").src = url;

                var blob = state._dataURLtoBlob(url);
                document.getElementById("blobImage").value = blob;

                state.props.updateImage(blob); //blob 파일 변경
            }

            image.src = event.target.result;

        }

        var uploadImage = document.getElementById("uploadImage");

        //check and retuns the length of uploded file.
        if (uploadImage.files.length === 0) {
            return;
        }

        this.props.updateName(uploadImage.files[0].name); //파일명 변경
        reader.readAsDataURL(uploadImage.files[0]);
    }

    render() {
        return (
            <div>
                <div>
                    <input id="blobImage" type="hidden" />
                    <input id="uploadImage" type="file" onChange={this._handleImageChange} />
                </div>
                <img id="uploadPreview" alt="이미지 미리보기"/>
            </div>
        );
    }

}

export default ImageUpload;
