import * as React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import firebase from "firebase";
import Room from "components/room/standalone";
import * as style from "./main.styl";

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

    return (
        <Router>
            <Switch>
                <Route path="/"><Room /></Route>
            </Switch>
        </Router>        
    );
};

render(<App />, document.querySelector("#app"));