import { assertUnavailable, TestPlayerRed, assertBonus, BlankBed } from "../../bed";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("鉄道", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("鉄道");
    });

    it("ボーナスとして工業系建造物x8点を得る", () => {
        const player: Player = {
            ...TestPlayerRed,
            buildings: [
                {card: "鉄道", workers: []},
                {card: "工場", workers: []},
                {card: "製鉄所", workers: []},
                {card: "自動車工場", workers: []},
                {card: "化学工場", workers: []},
                {card: "農場", workers: []}
            ]
        };

        assertBonus(playerAffected(BlankBed, player), 32);
    })
});