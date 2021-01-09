import * as React from "react";
import { Game } from "model/protocol/game/game";
import { PlayerIdentifier } from "model/protocol/game/player";
import { InRoundState, ExRoundState } from "model/protocol/game/state";
import { wage } from "model/protocol/game/board";

export interface GameProps {
    game: Game;
    me?: PlayerIdentifier;
}

export const GameContext = React.createContext<GameProps | null>(null);

export function withGame<P extends GameProps, R = Omit<P, keyof(GameProps)>>(Component: React.ComponentType<P>): React.ComponentType<R> {
    const component: React.FC<R> = props => (
        <GameContext.Consumer>
            {context => <Component {...props as any} {...context} />}
        </GameContext.Consumer>
    );
    component.displayName = `withGame(${Component.displayName})`;
    return component;
}

export function isWaitingFetch(props: GameProps): boolean {
    const inRoundState = props.game.state as InRoundState;
    return inRoundState.phase == "dispatching" && inRoundState.currentPlayer == props.me;
}

export function lackedCash(props: GameProps): number | undefined {
    if (props.me == undefined) return undefined;
    if ((props.game.state as ExRoundState)[props.me] != "selling") return undefined;
    const me = Object.values(props.game.board.players).find(p => p.id == props.me)!;
    return wage(props.game.board.currentRound) * me.workers.filter(w => w.type != "automata").length - me.cash;
}