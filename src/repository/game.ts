import * as firebase from "firebase";
import { Observable } from "rxjs";
import GameAndLog from "entity/gameandlog";
import { docData } from "rxfire/firestore";
import { Player } from "model/protocol/game/player";

export function fetchGame(db: firebase.firestore.Firestore, id: string): Observable<GameAndLog> {
    return docData(db.collection("games").doc(id));
}

export function updateGame(db: firebase.firestore.Firestore, id: string): (game: GameAndLog) => void {
    return (game: GameAndLog) => {
        db.collection("games").doc(id).update({board: game.board, state: game.state});
        db.collection("games").doc(id).update({log: firebase.firestore.FieldValue.arrayUnion(...game.log)});
    }
}

export function seat(db: firebase.firestore.Firestore, id: string, to: Player[]) {
    db.collection("games").doc(id).update({"board.players": to});
}