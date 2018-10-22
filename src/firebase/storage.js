import { storage } from './firebase';

export const getImageUrl = (imageUrl, key) =>

    storage.ref().child(imageUrl.imageUrl).getDownloadURL().then(function(url){
        document.getElementById(key).src = url;
        document.getElementById(key).className = "";
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
    name = Firebase.ServerValue.TIMESTAMP + name;
    console.log(name);
    return storage.ref().child(name).put(blob, metadata);
}
