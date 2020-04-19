import { PlayerIdentifier } from "./player";
import { CardName } from "./card";

export interface InRoundState {
    currentPlayer: PlayerIdentifier;
    phase: "dispatching" | "oncardeffect";
    effecting?: {
        card: CardName;
        step: number;
    }
}

export interface ExRoundPlayerStatus {
    status: "selling" | "discarding" | "finish";
}

export type ExRoundState = {[key: string]: ExRoundPlayerStatus};