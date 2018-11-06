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

export const getBoardRef = db.ref('boards');

export const doCreateBoard = (author, nickname, title, description, rating, tags, imageName, startedAt, dateWithFormat) => {
    let key = getBoardRef.push().key;
    let model = {author, nickname, title, description, rating, tags, imageName, startedAt, dateWithFormat};
    return db.ref('boards/'+ key).set(model);
};

export const onceGetBoardDetail = (id) =>
    db.ref('boards/' + id).once('value');

export const onceRemoveBoard = (id) =>
    db.ref('boards/' + id).remove();


// Comment API

export const doRegComment = (boardKey, nickname, contents, rating, startedAt, dateWithFormat) => {
    let key = db.ref('comments').push().key;
    let model = {boardKey, nickname, contents, rating, startedAt, dateWithFormat};
    return db.ref('comments/'+ key).set(model);
}

export const onceGetComments = (key) =>
    db.ref('comments').orderByChild("boardKey").equalTo(key).once('value');


const commentRef = db.ref('comments');

export const onceRemoveComments = (key) =>
    commentRef.orderByChild("boardKey").equalTo(key).on('child_added', snapshot => {
        snapshot.ref.remove()
    });