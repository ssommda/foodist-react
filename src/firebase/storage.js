import { storage } from './firebase';

//이미지 url 가져오기
export const getImageUrl = (imageUrl, imageID) => {
    const imageRef = storage.ref().child(imageUrl);
    imageRef.getDownloadURL().then(function(url) {
        const targetDOM = document.getElementById(imageID);
        if(targetDOM){
            targetDOM.style.backgroundImage = "url(" + url + ")";
        }
    });
};

//이미지 업로드
export const uploadImage = (blob, name) => {
    const metadata = {
        contentType: 'image/jpeg'
    };
    return storage.ref().child(name).put(blob, metadata);
};

//이미지 삭제
export const getImageRef = (imageUrl) =>
    storage.ref().child(imageUrl);
