import "mocha";
import { assertUnavailable, assertBonus, BlankBed, TestPlayerRed } from "test/interaction/bed";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("消費者組合", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("消費者組合");
    });

    it("ボーナスとして保有する農業系建物の価値が20以上のとき18点を得る", () => {
        const ngPlayer: Player = {...TestPlayerRed, buildings: [{card: "消費者組合", workers: []}, {card: "精錬所", workers: []}]};
        assertBonus(playerAffected(BlankBed, ngPlayer), 0);

        const okPlayer: Player = {
            ...TestPlayerRed,
            buildings: [{card: "消費者組合", workers: []}, {card: "綿花農場", workers: []}, {card: "農村", workers: []}]
        };
        assertBonus(playerAffected(BlankBed, okPlayer), 18);
    });
});