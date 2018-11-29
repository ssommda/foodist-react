import { db } from './firebase';

// User API

const userRef = db.collection("users");

export const doCreateUser = (id, nickname, email) =>
    userRef.doc(id).set({
        nickname,
        email,
    });

export const getUsernickname = (loginEmail) =>
    userRef.where("email", "==", loginEmail).get();


// Board API

export const boardRef = db.collection("boards");

export const getBoardDetail = (id) =>
    boardRef.doc(id).get();

export const doCreateBoard = (author, nickname, title, description, rating, tags, imageName, dateWithFormat) => {
    let model = {author, nickname, title, description, rating, tags, imageName, dateWithFormat};
    return boardRef.add(model);
};

export const removeBoard = (id) =>
    boardRef.doc(id).delete();

// Comment API
export const getComments = (key) =>
    boardRef.doc(key).collection('comments').orderBy("dateWithFormat", "desc").get();

export const doRegComment = (boardKey, nickname, contents, rating, dateWithFormat) => {
    let model = {nickname, contents, rating, dateWithFormat};
    return boardRef.doc(boardKey).collection('comments').add(model)
};

// export const removeComments = (id) =>
//     boardRef.doc(id).collection('comments').delete();