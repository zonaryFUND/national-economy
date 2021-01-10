import "mocha";
import { assertUnavailable, assertBonus, BlankBed, TestPlayerRed } from "test/interaction/bed";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("技術展示会", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("技術展示会");
    });

    it("ボーナスとして保有する工業系建物の価値が30以上のとき24点を得る", () => {
        const ngPlayer: Player = {...TestPlayerRed, buildings: [{card: "技術展示会", workers: []}, {card: "精錬所", workers: []}]};
        assertBonus(playerAffected(BlankBed, ngPlayer), 0);

        const okPlayer: Player = {
            ...TestPlayerRed,
            buildings: [{card: "技術展示会", workers: []}, {card: "精錬所", workers: []}, {card: "蒸気工場", workers: []}, {card: "蒸気工場", workers: []}]
        };
        assertBonus(playerAffected(BlankBed, okPlayer), 24);
    });
});