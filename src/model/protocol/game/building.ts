import { CardName } from "./card";
import { PlayerIdentifier, WorkerType } from "./player";

export interface Building {
    card: CardName;
    workers: {owner: PlayerIdentifier, type: WorkerType}[];
}
