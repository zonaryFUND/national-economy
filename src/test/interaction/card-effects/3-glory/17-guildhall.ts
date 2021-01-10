import "mocha";
import { assertUnavailable, assertBonus, BlankBed, TestPlayerRed } from "test/interaction/bed";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("ギルドホール", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("ギルドホール");
    });

    it("ボーナスとして農業系建物と工業系建物を保有しているとき20点を得る", () => {
        const ngPlayer: Player = {...TestPlayerRed, buildings: [{card: "ギルドホール", workers: []}, {card: "精錬所", workers: []}]};
        assertBonus(playerAffected(BlankBed, ngPlayer), 0);

        const okPlayer: Player = {
            ...TestPlayerRed,
            buildings: [{card: "ギルドホール", workers: []}, {card: "綿花農場", workers: []}, {card: "精錬所", workers: []}]
        };
        assertBonus(playerAffected(BlankBed, okPlayer), 20);
    });
});