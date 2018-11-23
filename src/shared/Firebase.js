import * as firebase from 'firebase'
let database;
let config = {
    apiKey: "AIzaSyDm1wfoOtLtNLJ_sEohfH1pZEcmCZlo28g",
    authDomain: "foodist-react.firebaseapp.com",
    databaseURL: "https://foodist-react.firebaseio.com",
    projectId: "foodist-react",
    storageBucket: "foodist-react.appspot.com",
    messagingSenderId: "725694631938"
}
firebase.initializeApp(config);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(function() {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        return firebase.auth().signInWithEmailAndPassword(email, password);
    })
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
    });