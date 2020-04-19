import { CardName } from "./card";
import { PlayerIdentifier } from "./player";

export interface Building {
    card: CardName;
    workersOwner: PlayerIdentifier[];
}
