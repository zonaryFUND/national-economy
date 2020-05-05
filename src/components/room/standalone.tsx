import * as React from "react";
import { launch } from "model/launch";
import { GameContext } from "./context/game";
import Room from "./room";
import { GatewayContext, GatewayProviderProps } from "./context/gateway";
import toastr from "toastr";
import { Game } from "model/protocol/game/game";
import { ExRoundState } from "model/protocol/game/state";

const standAlone: React.FC = props => {
    const [game, setGame] = React.useState(launch(["test1"]));
    /*
    const [game, setGame] = React.useState<Game>({
        ...BlankBed,
        state: {
            currentPlayer: "red",
            phase: "oncardeffect",
            effecting: "設計事務所",
            revealing: ["不動産屋", "化学工場", "大農園", "法律事務所", "社宅"]
        }
    });
    */
    const [logs, setLogs] = React.useState<string[]>([]);
    const myId = "red";

    const gateway: GatewayProviderProps = {
        update: result => {
            setGame(result[0]);
            setLogs(logs.concat(result[1]));
        },
        error: message => {
            toastr.error(message);
        }
    };

    return (
        <GatewayContext.Provider value={gateway}>
            <GameContext.Provider value={{game: game, me: myId}}>
                <Room logs={logs} />
            </GameContext.Provider>
        </GatewayContext.Provider>
    );
};

export default standAlone;