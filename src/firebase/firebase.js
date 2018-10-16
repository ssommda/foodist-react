import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/database';

const config = {
    apiKey: "AIzaSyDm1wfoOtLtNLJ_sEohfH1pZEcmCZlo28g",
    authDomain: "foodist-react.firebaseapp.com",
    databaseURL: "https://foodist-react.firebaseio.com",
    projectId: "foodist-react",
    storageBucket: "foodist-react.appspot.com",
    messagingSenderId: "725694631938"
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();

export {
    db,
    auth,
};