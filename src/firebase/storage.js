import { storage } from './firebase';

export const getImageUrl = (imageUrl, imageID) =>

    storage.ref().child(imageUrl).getDownloadURL().then(function(url){
        document.getElementById(imageID).src = url;
        document.getElementById(imageID).className = "";
    }).catch(function(error) {

        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
            case 'storage/object_not_found':
                // File doesn't exist
                break;

            case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;

            case 'storage/canceled':
                // User canceled the upload
                break;

            case 'storage/unknown':
                // Unknown error occurred, inspect the server response
                break;
            default :
                //
                break;
        }
    });

export const uploadImage = (blob, name) => {
    const metadata = {
        contentType: 'image/jpeg'
    };
    return storage.ref().child(name).put(blob, metadata);
}
