import { Player, PlayerIdentifier } from "./player";
import { Building } from "./building";
import { CardName } from "./card";

export interface Board {
    currentRound: number;
    deck: CardName[];
    trash: CardName[];
    leftConsumerGoods: number;
    houseHold: number;
    players: Player[];
    startPlayer: PlayerIdentifier;
    publicBuildings: Building[];
    soldBuildings: Building[];
}