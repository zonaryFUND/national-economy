import { assertUnavailable, TestPlayerRed, assertBonus, BlankBed } from "../../bed";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("農協", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("農協");
    });

    it("ボーナスとして手札の消費財x3点を得る", () => {
        const player: Player = {
            ...TestPlayerRed,
            buildings: [{card: "農協", workers: []}],
            hand: ["消費財", "消費財", "消費財", "消費財"]
        };

        assertBonus(playerAffected(BlankBed, player), 12);
    })
});