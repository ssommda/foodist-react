import { db } from './firebase';

// User API

export const doCreateUser = (id, nickname, email) =>
    db.ref(`users/${id}`).set({
        nickname,
        email,
    });

export const onceGetUsers = () =>
    db.ref('users').once('value');


// Board API

export const doCreateBoard = (author, title, description, rating, tags, image) => {
    let key = db.ref('boards').push().key;
    let model = {author, title, description, rating, tags, image};
    return db.ref('boards/'+ key).set(model);
}


export const onceGetBoards = () =>
    db.ref('boards').once('value');
    // db.ref('boards').once('value', function(snapshot) {
    //     snapshot.forEach(function(childSnapshot) {
    //         var childKey = childSnapshot.key;
    //         var childData = childSnapshot.val();
    //     });
    // });
