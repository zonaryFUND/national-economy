import * as React from "react";
import { Observable } from "rxjs";
import { Game } from "model/protocol/game/game";
import useObservable from "components/common/use-observable";
import { GameContext } from "./context/game";
import { GatewayContext, GatewayProviderProps } from "./context/gateway";
import Room from "./room";
import { EffectLog } from "model/interaction/game/sync-effect";
import { PlayerIdentifier, Player } from "model/protocol/game/player";
import GameAndLog from "entity/gameandlog";
import { ResultState } from "model/protocol/game/state";
import toastr from "toastr";

export interface FireProps {
    observable: (id: string) => Observable<GameAndLog>;
    update: (id: string) => (result: [Game, EffectLog]) => void;
    seat: (id: string, index: number, name: string) => void;
}

export const FireContext = React.createContext<FireProps | null>(null);

interface Props {
    id: string;
    myname?: string;
    setMyname: (name: string) => void;
    onFinish: () => void;
}

export interface SeatProps {
    seat: (name: string, id: PlayerIdentifier) => void;
}

export const SeatContext = React.createContext<SeatProps | null>(null);

const Inner: React.FC<Props & FireProps> = props => {
    const [game, error] = useObservable(props.observable(props.id));
    const me = game && props.myname ? Object.values(game.board.players).find(p => p.name == props.myname) : undefined;
    const myID = me ? me.id : undefined;

    if (game && (game.state as ResultState).winner != undefined) props.onFinish();

    const gateway: GatewayProviderProps = {
        update: props.update(props.id),
        error: message => toastr.error(message)
    };

    React.useEffect(() => {
        if (myID) {
            const leave = (e: BeforeUnloadEvent) => {
                const index = Object.values(game!.board.players).findIndex(p => p.name == props.myname)!;
                if (index >= 0) props.seat(props.id, index, "");
                e.returnValue = "ページを離れようとしたので、席から外れました。"
            };
            window.addEventListener("beforeunload", leave);
            return () => {
                const index = Object.values(game!.board.players).findIndex(p => p.name == props.myname)!;
                if (index >= 0) props.seat(props.id, index, "");
                window.removeEventListener("beforeunload", leave);
            }
        }

        return () => {};
    }, [myID]);

    const seat: SeatProps = {
        seat: (name, id) => {
            props.setMyname(name);
            const index = Object.values(game!.board.players).findIndex(p => p.id == id)!;
            props.seat(props.id, index, name);
        }
    };

    if (game) {
        return (
            <SeatContext.Provider value={seat}>
                <GameContext.Provider value={{game: game, me: me?.id}}>
                    <GatewayContext.Provider value={gateway}>
                        <Room logs={game.log} />
                    </GatewayContext.Provider>
                </GameContext.Provider>
            </SeatContext.Provider>
        );
    } else {
        return null;
    }
}

const fire: React.FC<Props> = props => (
    <FireContext.Consumer>
        {context => <Inner {...props} {...context!} />}
    </FireContext.Consumer>
);

export default fire;