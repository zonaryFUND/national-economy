import { CardName } from "./card";
import { Building } from "./building";

export type PlayerIdentifier = "red" | "purple" | "orange" | "blue";

export interface Player {
    id: PlayerIdentifier;
    name?: string;
    hand: CardName[];
    workers: {available: number, training: number, employed: number};
    buildings: Building[];
    cash: number;
    penalty: number;
}