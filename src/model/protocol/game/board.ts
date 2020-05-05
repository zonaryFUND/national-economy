import { Player, PlayerIdentifier } from "./player";
import { Building } from "./building";
import { CardName } from "./card";

export interface Board {
    currentRound: number;
    deck: CardName[];
    trash: CardName[];
    houseHold: number;
    players: {[index: number]: Player};
    startPlayer: PlayerIdentifier;
    publicBuildings: Building[];
    soldBuildings: Building[];
}

export function wage(round: number): number {
    return [2, 2, 3, 3, 3, 4, 4, 5, 5][round - 1];
}