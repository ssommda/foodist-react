import { db } from "./firebase";
import database from "./database.json";

var allEntityNames = Object.keys(database);

export const migrationFunc = () => {

    for (let i in allEntityNames) {
        var entityName = allEntityNames[i];
        var entity = database[entityName];

        var boardKey = entity.boardKey;

        delete entity.boardKey;


        console.log("began migrating "+ entityName);

        db.collection("boards").doc(boardKey).collection('comments').doc(entityName).set(entity)
            .then(function() {
                console.log("성공" + i)
            })
            .catch(function(error) {
                console.log(error);
            });
    }

}