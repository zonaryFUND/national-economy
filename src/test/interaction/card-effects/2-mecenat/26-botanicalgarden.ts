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
                {card: "植物園", workersOwner: []},
                {card: "芋畑", workersOwner: []},
                {card: "菜園", workersOwner: []},
                {card: "石油コンビナート", workersOwner: []},
            ]
        };
        assertBonus(playerAffected(BlankBed, ngPlayer), 0);

        const okPlayer: Player = {
            ...TestPlayerRed,
            buildings: [
                {card: "植物園", workersOwner: []},
                {card: "芋畑", workersOwner: []},
                {card: "菜園", workersOwner: []},
                {card: "旧市街", workersOwner: []},
            ]
        };
        assertBonus(playerAffected(BlankBed, okPlayer), 22);
    });
});