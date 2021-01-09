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
                {card: "輸出港", workers: []},
                {card: "工業団地", workers: []},
                {card: "投資銀行", workers: []}
            ]
        };
        assertBonus(playerAffected(BlankBed, ngPlayer), 0);

        const okPlayer: Player = {
            ...TestPlayerRed,
            buildings: [
                {card: "輸出港", workers: []},
                {card: "工業団地", workers: []},
                {card: "旧市街", workers: []}
            ]
        };
        assertBonus(playerAffected(BlankBed, okPlayer), 24);
    });
});