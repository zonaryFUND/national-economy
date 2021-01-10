import "mocha";
import { assertUnavailable, assertBonus, BlankBed, TestPlayerRed } from "test/interaction/bed";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("収穫祭", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("収穫祭");
    });

    it("ボーナスとして手札に消費財が4枚以上あるとき26点を得る", () => {
        const ngPlayer: Player = {...TestPlayerRed, buildings: [{card: "収穫祭", workers: []}]};
        assertBonus(playerAffected(BlankBed, ngPlayer), 0);

        const okPlayer: Player = {
            ...TestPlayerRed,
            hand: ["消費財", "消費財", "消費財", "消費財"],
            buildings: [{card: "収穫祭", workers: []}]
        };
        assertBonus(playerAffected(BlankBed, okPlayer), 26);
    });
});