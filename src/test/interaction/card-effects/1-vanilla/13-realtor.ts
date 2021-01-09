import { assertUnavailable, TestPlayerRed, assertBonus, BlankBed } from "../../bed";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("不動産屋", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("不動産屋");
    });

    it("ボーナスとして建造物x3点を得る", () => {
        const player: Player = {
            ...TestPlayerRed,
            buildings: [
                {card: "不動産屋", workers: []},
                {card: "珈琲店", workers: []},
                {card: "ゼネコン", workers: []},
                {card: "邸宅", workers: []},
                {card: "農協", workers: []}
            ]
        };

        assertBonus(playerAffected(BlankBed, player), 15);
    });
})