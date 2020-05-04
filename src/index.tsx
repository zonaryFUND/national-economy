import * as React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import firebase from "firebase";
import Room from "components/room/standalone";
import * as style from "./main.styl";
import Entrance from "components/entrance/entrance";
import { fetchRoom, joinRoom, leaveRoom, createGame, rooms, finishGame } from "repository/room";
import { FireContext, FireProps } from "components/room/fire";
import { fetchGame, updateGame, seat } from "repository/game";
import { Game } from "model/protocol/game/game";
import { EffectLog } from "model/interaction/game/sync-effect";
import Lobby from "components/lobby/lobby";
import lobby from "components/lobby/lobby";

const db = firebase.initializeApp({
    apiKey: "AIzaSyB-Ww7NS84kvCLDqN30SgIQEpGJA_P4Vfo",
    authDomain: "zonary-naco.firebaseapp.com",
    databaseURL: "https://zonary-naco.firebaseio.com",
    projectId: "zonary-naco",
    storageBucket: "zonary-naco.appspot.com",
    messagingSenderId: "325582944751",
    appId: "1:325582944751:web:07463ea981e906fdfa1e1a"
  }).firestore();

const App: React.FC = () => {
    React.useEffect(() => {
        document.documentElement.className = style.root
    }, []);

    const fire: FireProps = {
        observable: id => fetchGame(db, id),
        update: id => (result: [Game, EffectLog]) => updateGame(db, id)({...result[0], log: result[1]}),
        seat: (id, players) => seat(db, id, players)
    };

    return (
        <Router>
            <Switch>
                <Route path="/:id">
                    <FireContext.Provider value={fire}>
                        <Entrance 
                            room={id => fetchRoom(db, id)} 
                            join={(id, name) => joinRoom(db, id, name)}
                            leave={(id, name) => leaveRoom(db, id, name)}
                            createGame={(id, game) => createGame(db, id, game)}
                            finish={id => finishGame(db, id)}
                        />
                    </FireContext.Provider>
                </Route>
                <Route path="/"><Lobby stream={rooms(db)} /></Route>
            </Switch>
        </Router>        
    );
};

render(<App />, document.querySelector("#app"));