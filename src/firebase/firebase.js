import firebase from 'firebase/app';
import 'firebase/auth';
// import 'firebase/database';
import 'firebase/storage';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyDm1wfoOtLtNLJ_sEohfH1pZEcmCZlo28g",
    authDomain: "foodist-react.firebaseapp.com",
    databaseURL: "https://foodist-react.firebaseio.com",
    projectId: "foodist-react",
    storageBucket: "foodist-react.appspot.com",
    messagingSenderId: "725694631938"
};

if (!firebase.apps.length) {
    firebase.initializeApp(config, {
        timestampsInSnapshots: true
    });
}

// const db = firebase.database();
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

db.settings({timestampsInSnapshots: true});

export {
    db,
    auth,
    storage
};