import { Board } from "./board";
import { InRoundState, ExRoundState } from "./state";

export interface Game {
    board: Board;
    state: InRoundState | ExRoundState | "result";
}