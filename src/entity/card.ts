export type BuildingType = "unsellable" | "agricultural" | "industrial";

export interface Card {
    name: string;
    type: "public" | "building" | "consumer-goods"
    cost: number | undefined;
    imageURL: string;
    description: string;
    buildingType: BuildingType[];
    score: number | undefined;
}