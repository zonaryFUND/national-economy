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

export interface FireProps {
    observable: (id: string) => Observable<GameAndLog>;
    update: (id: string) => (result: [Game, EffectLog]) => void;
    seat: (id: string, players: Player[]) => void;
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
    const me = props.myname ? game?.board.players.find(p => p.name == props.myname) : undefined;

    if (game && (game.state as ResultState).winner != undefined) props.onFinish();

    const gateway: GatewayProviderProps = {
        update: props.update(props.id),
        error: message => {}
    };

    React.useEffect(() => {
        if (props.myname) {
            const remover = () => {
                const players = game!.board.players.map(p => {
                    if (p.name == props.myname) return {...p, name: ""};
                    return p
                });
                props.seat(props.id, players);
            };
            window.addEventListener("beforeunload", remover);
            return () => {
                window.removeEventListener("beforeunload", remover);
            }
        }
        return () => {};
    }, [props.myname, game]);

    const seat: SeatProps = {
        seat: (name, id) => {
            props.setMyname(name);
            const players = game!.board.players.map(p => {
                if (p.id == id) return {...p, name: name};
                return p
            });
            props.seat(props.id, players);
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