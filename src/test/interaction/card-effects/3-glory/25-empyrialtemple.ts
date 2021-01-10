import "mocha";
import { assertUnavailable, assertBonus, BlankBed, TestPlayerRed } from "test/interaction/bed";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("浄火の神殿", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("浄火の神殿");
    });

    it("ボーナスとして保有する売却不可建物がこれだけのとき30点を得る", () => {
        const ngPlayer: Player = {...TestPlayerRed, buildings: [{card: "浄火の神殿", workers: []}, {card: "技術展示会", workers: []}]};
        assertBonus(playerAffected(BlankBed, ngPlayer), 0);

        const okPlayer: Player = {
            ...TestPlayerRed,
            buildings: [{card: "浄火の神殿", workers: []}, {card: "精錬所", workers: []}, {card: "蒸気工場", workers: []}, {card: "蒸気工場", workers: []}]
        };
        assertBonus(playerAffected(BlankBed, okPlayer), 30);
    });
});