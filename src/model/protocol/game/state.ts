import { PlayerIdentifier } from "./player";
import { CardName } from "./card";

export interface InRoundState {
    currentPlayer: PlayerIdentifier;
    phase: "dispatching" | "oncardeffect";
    effecting?: {
        card: CardName;
        address: {
            to: "mine" | "public" | "sold";
            index: number;
        };
    }
    revealing?: CardName[]
}

export type ExRoundPlayerStatus = "selling" | "discarding" | "confirm" | "finish";
export type ExRoundState = {[key: string]: ExRoundPlayerStatus};

export interface PlayerResult {
    cash: number;
    buildings: number;
    victoryToken: number;
    penalty: number;
    bonus: number; 
    total: number;
}

export interface ResultState {
    winner: string;
};