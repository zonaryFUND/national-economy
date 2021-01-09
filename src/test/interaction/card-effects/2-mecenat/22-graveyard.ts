import "mocha";
import { assertUnavailable, assertBonus, BlankBed, TestPlayerRed } from "test/interaction/bed";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("墓地", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("墓地");
    });

    it("ボーナスとして手札がないとき8点を得る", () => {
        const ngPlayer: Player = {...TestPlayerRed, hand: ["博物館"], buildings: [{card: "墓地", workers: []}]};
        assertBonus(playerAffected(BlankBed, ngPlayer), 0);

        const okPlayer: Player = {
            ...TestPlayerRed,
            buildings: [{card: "墓地", workers: []}]
        };
        assertBonus(playerAffected(BlankBed, okPlayer), 8);
    });
});