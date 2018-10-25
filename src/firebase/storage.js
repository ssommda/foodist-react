import { storage } from './firebase';

export const getImageUrl = (imageUrl, imageID) =>

    storage.ref().child(imageUrl).getDownloadURL().then(function(url){
      document.getElementById(imageID).style.backgroundImage = "url(" + url + ")";
        // document.getElementById(imageID).src = url;
        // document.getElementById(imageID).className = "";
    });

export const uploadImage = (blob, name) => {
    const metadata = {
        contentType: 'image/jpeg'
    };
    return storage.ref().child(name).put(blob, metadata);
}
