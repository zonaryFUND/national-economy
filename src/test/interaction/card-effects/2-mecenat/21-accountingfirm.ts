import "mocha";
import { assertUnavailable, TestPlayerRed, assertBonus, BlankBed } from "test/interaction/bed";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("会計事務所", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("会計事務所");
    });

    it("ボーナスとして勝利点トークンの価値と同量を得る", () => {
        const player: Player = {
            ...TestPlayerRed,
            victoryToken: 8,
            buildings: [{card: "会計事務所", workersOwner: []}]
        };

        assertBonus(playerAffected(BlankBed, player), 22);
    });
});