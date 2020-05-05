import * as firebase from "firebase";
import { Observable } from "rxjs";
import GameAndLog from "entity/gameandlog";
import { docData } from "rxfire/firestore";

export function fetchGame(db: firebase.firestore.Firestore, id: string): Observable<GameAndLog> {
    return docData(db.collection("games").doc(id));
}

export function updateGame(db: firebase.firestore.Firestore, id: string): (game: GameAndLog) => void {
    return (game: GameAndLog) => {
        if (game.log.length > 0)
            db.collection("games").doc(id).update({board: game.board, state: game.state, log: firebase.firestore.FieldValue.arrayUnion(...game.log)});
        else
            db.collection("games").doc(id).update({board: game.board, state: game.state});
    }
}

export function seat(db: firebase.firestore.Firestore, id: string, index: number, name: string) {
    const query = `board.players.${index}.name`;
    db.collection("games").doc(id).update({[query]: name});
}