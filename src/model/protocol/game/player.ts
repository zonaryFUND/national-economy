import { CardName } from "./card";
import { Building } from "./building";

export type PlayerIdentifier = "red" | "purple" | "orange" | "blue";

export type WorkerType = "human" | "training-human" | "automata";
export type Worker = {
    type: WorkerType,
    fetched: boolean
};

export interface Player {
    id: PlayerIdentifier;
    name?: string;
    hand: CardName[];
    workers: Worker[];
    buildings: Building[];
    cash: number;
    victoryToken: number;
    reservedCards: CardName[];
    penalty: number;
}