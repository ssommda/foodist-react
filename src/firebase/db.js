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
    let model = {author, nickname, title, description, rating, tags, imageName, startedAt, dateWithFormat};
    return db.ref('boards/'+ key).set(model);
}

export const onceGetBoards = (pageNum) =>
    db.ref('boards').limitToFirst(pageNum).once('value');
    // db.ref('boards').once('value');

export const onceGetBoardDetail = (id) =>
    db.ref('boards/' + id).once('value');

export const onceRemoveBoard = (id) =>
    db.ref('boards/' + id).remove();

export const onceGetSearchByTag = (tag, pageNum) =>
    db.ref().child('boards').orderByChild('tags/' + tag).equalTo(true).limitToFirst(pageNum).once('value');
    // db.ref().child('boards').orderByKey().equalTo(tag).once('value');


// Comment API

export const doRegComment = (boardKey, nickname, contents, rating, startedAt, dateWithFormat) => {
    let key = db.ref('comments').push().key;
    let model = {boardKey, nickname, contents, rating, startedAt, dateWithFormat};
    return db.ref('comments/'+ key).set(model);
}

export const onceGetComments = (key) =>
    db.ref('comments').orderByChild("boardKey").equalTo(key).once('value');

// export const onceRemoveComments = (key) =>
//     db.ref('comments').orderByChild("boardKey").equalTo(key).remove();
