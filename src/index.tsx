import * as React from "react";
import { render } from "react-dom";

const App: React.FC = () => {
    return (
        <h1>test</h1>
    );
};

render(<App />, document.querySelector("#app"));