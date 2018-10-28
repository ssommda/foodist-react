import { storage } from './firebase';

export const getImageUrl = (imageUrl, imageID) => {
    const imageRef = storage.ref().child(imageUrl);
    imageRef.getDownloadURL().then(function(url) {
      document.getElementById(imageID).style.backgroundImage = "url(" + url + ")";
    });
};

export const uploadImage = (blob, name) => {
    const metadata = {
        contentType: 'image/jpeg'
    };
    return storage.ref().child(name).put(blob, metadata);
}
