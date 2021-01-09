import "mocha";
import { assertUnavailable, TestPlayerRed, assertBonus, BlankBed } from "test/interaction/bed";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("植物園", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("植物園");
    });

    it("ボーナスとして農業系建造物が3つ以上あるとき22点を得る", () => {
        const ngPlayer: Player = {
            ...TestPlayerRed,
            buildings: [
                {card: "植物園", workers: []},
                {card: "芋畑", workers: []},
                {card: "菜園", workers: []},
                {card: "石油コンビナート", workers: []},
            ]
        };
        assertBonus(playerAffected(BlankBed, ngPlayer), 0);

        const okPlayer: Player = {
            ...TestPlayerRed,
            buildings: [
                {card: "植物園", workers: []},
                {card: "芋畑", workers: []},
                {card: "菜園", workers: []},
                {card: "旧市街", workers: []},
            ]
        };
        assertBonus(playerAffected(BlankBed, okPlayer), 22);
    });
});