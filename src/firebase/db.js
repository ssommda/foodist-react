import { db } from './firebase';

// User API

export const doCreateUser = (id, nickname, email) =>
    db.ref(`users/${id}`).set({
        nickname,
        email,
    });

export const onceGetUsers = () =>
    db.ref('users').once('value');

export const onceGetUsernickname = (loginEmail) =>
    db.ref('users').orderByChild("email").equalTo(loginEmail).once('value');


// Board API

export const doCreateBoard = (author, nickname, title, description, rating, tags, imageName, startedAt, dateWithFormat) => {
    let key = db.ref('boards').push().key;
    // imageName = Date.now() + "_" + imageName;
    let model = {author, nickname, title, description, rating, tags, imageName, startedAt, dateWithFormat};
    return db.ref('boards/'+ key).set(model);
}


export const onceGetBoards = () =>
    db.ref('boards').once('value');

export const onceGetBoardDetail = (id) =>
    db.ref('boards/' + id).once('value');