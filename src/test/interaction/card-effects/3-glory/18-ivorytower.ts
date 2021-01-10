import "mocha";
import { assertUnavailable, assertBonus, BlankBed, TestPlayerRed } from "test/interaction/bed";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("象牙の塔", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("象牙の塔");
    });

    it("ボーナスとして勝利点トークンを7枚以上持っているとき22点を得る", () => {
        const ngPlayer: Player = {...TestPlayerRed, victoryToken: 6, buildings: [{card: "象牙の塔", workers: []}]};
        assertBonus(playerAffected(BlankBed, ngPlayer), 0);

        const okPlayer: Player = {
            ...TestPlayerRed,
            victoryToken: 7,
            buildings: [{card: "象牙の塔", workers: []}]
        };
        assertBonus(playerAffected(BlankBed, okPlayer), 22);
    });
});