import { storage } from './firebase';

//이미지 url 가져오기
export const getImageUrl= (imageUrl) => {
    const imageRef = storage.ref().child(imageUrl);
    return imageRef.getDownloadURL();
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
