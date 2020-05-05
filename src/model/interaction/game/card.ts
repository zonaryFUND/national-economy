import { CardName } from "model/protocol/game/card";
import { Player } from "model/protocol/game/player";

export type BuildingType = "unsellable" | "agricultural" | "industrial";

export interface Card {
    name: CardName;
    type: "public" | "building" | "consumer-goods"
    cost: number | undefined;
    costReduction?: {
        description: string;
        to: (player: Player) => number;
    };
    imageURL: string;
    description: string;
    buildingType: BuildingType[];
    score: number | undefined;
    bonusScore?: (player: Player) => number;
    canAcceptMultiWorkers?: boolean;
}