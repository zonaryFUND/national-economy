import { Board } from "./board";
import { InRoundState, ExRoundState, ResultState } from "./state";
import { Player } from "./player";

export interface Game {
    board: Board;
    state: InRoundState | ExRoundState | ResultState;
}

export interface GameIO {
    game: Game;
    shuffle<T>(array: Array<T>): Array<T>;
}

export function getCurrentPlayer(game: Game): Player | undefined {
    const id = (game.state as InRoundState).currentPlayer;
    return id ? game.board.players.find(p => p.id == id) : undefined;
}