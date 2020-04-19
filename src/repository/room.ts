import * as firebase from "firebase";
import { Observable } from "rxjs";
import { docData } from "rxfire/firestore";

/*
export function fetchIngameState(db: firebase.firestore.Firestore, roomName: string): Observable<boolean> {
    docData(db.collection("rooms").doc(roomName)).pipe()
    return Observable.create((observer: firebase.Observer) => {
        db.collection("rooms").doc(roomName).onSnapshot(snapshot => {
            observer.onNext(snapshot.get("game_id") != "");
        return 
    });
}
*/