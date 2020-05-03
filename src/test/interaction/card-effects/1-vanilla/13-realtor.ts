import { assertUnavailable, TestPlayerRed, assertBonus, playerAffected, BlankBed } from "../../bed";
import { Player } from "model/protocol/game/player";

describe("不動産屋", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("不動産屋");
    });

    it("ボーナスとして建造物x3点を得る", () => {
        const player: Player = {
            ...TestPlayerRed,
            buildings: [
                {card: "不動産屋", workersOwner: []},
                {card: "珈琲店", workersOwner: []},
                {card: "ゼネコン", workersOwner: []},
                {card: "邸宅", workersOwner: []},
                {card: "農協", workersOwner: []}
            ]
        };

        assertBonus(playerAffected(BlankBed, player), 15);
    });
})