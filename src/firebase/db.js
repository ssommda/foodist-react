import { db } from './firebase';

// User API

export const doCreateUser = (id, nickname, email) =>
    db.ref(`users/${id}`).set({
        nickname,
        email,
    });

export const onceGetUsers = () =>
    db.ref('users').once('value');

export const onceGetUsernickname = (loginEmail) => {
    const nickname
    db.ref('users').orderByChild("email").equalTo(loginEmail).on('value', function (snapshot) {
        //snapshot would have list of NODES that satisfies the condition
        console.log(snapshot.val())
        nickname = snapshot.val();
        console.log('-----------');
        //go through each item found and print out the emails
        snapshot.forEach(function(childSnapshot) {
            // var key = childSnapshot.key;
            var childData = childSnapshot.val();
            //this will be the actual email value found
            console.log(childData.nickname);
        }
    });
    return nickname;
}


// Board API

export const doCreateBoard = (author, nickname, title, description, rating, tags, imageName, startedAt, dateWithFormat) => {
    let key = db.ref('boards').push().key;
    // imageName = Date.now() + "_" + imageName;
    let model = {author, nickname, title, description, rating, tags, imageName, startedAt, dateWithFormat};
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
