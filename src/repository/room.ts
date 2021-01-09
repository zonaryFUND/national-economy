import * as firebase from "firebase";
import { Observable } from "rxjs";
import { docData, collectionData } from "rxfire/firestore";
import { Room } from "entity/room";
import { Game } from "model/protocol/game/game";

export function rooms(db: firebase.firestore.Firestore): Observable<Room[]> {
    return collectionData(db.collection("rooms"));
}

export function fetchRoom(db: firebase.firestore.Firestore, id: string): Observable<Room> {
    return docData(db.collection("rooms").doc(`room${id}`));
}

export function joinRoom(db: firebase.firestore.Firestore, id: string, name: string) {
    db.collection("rooms").doc(`room${id}`).update({players: firebase.firestore.FieldValue.arrayUnion(name)}).catch(console.log);
}

export function leaveRoom(db: firebase.firestore.Firestore, id: string, name: string) {
    db.collection("rooms").doc(`room${id}`).update({players: firebase.firestore.FieldValue.arrayRemove(name)});
}

export function createGame(db: firebase.firestore.Firestore, id: string, game: Game) {
    db.collection("games").add(game)
        .then(doc => db.collection("rooms").doc(`room${id}`).update({game_id: doc.id}));
}

export function finishGame(db: firebase.firestore.Firestore, id: string) {
    db.collection("rooms").doc(`room${id}`).update({game_id: "", players: []});
}