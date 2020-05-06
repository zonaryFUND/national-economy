import "mocha";
import { assertUnavailable, assertBonus, BlankBed, TestPlayerRed } from "test/interaction/bed";
import { playerAffected } from "model/interaction/game/util";
import { Player } from "model/protocol/game/player";

describe("輸出港", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("輸出港");
    });

    it("ボーナスとして工業系建物が2つ以上あるとき24点を得る", () => {
        const ngPlayer: Player = {
            ...TestPlayerRed,
            buildings: [
                {card: "輸出港", workersOwner: []},
                {card: "工業団地", workersOwner: []},
                {card: "投資銀行", workersOwner: []}
            ]
        };
        assertBonus(playerAffected(BlankBed, ngPlayer), 0);

        const okPlayer: Player = {
            ...TestPlayerRed,
            buildings: [
                {card: "輸出港", workersOwner: []},
                {card: "工業団地", workersOwner: []},
                {card: "旧市街", workersOwner: []}
            ]
        };
        assertBonus(playerAffected(BlankBed, okPlayer), 24);
    });
});