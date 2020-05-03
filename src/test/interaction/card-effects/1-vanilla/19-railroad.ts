import { assertUnavailable, TestPlayerRed, assertBonus, playerAffected, BlankBed } from "../../bed";
import { Player } from "model/protocol/game/player";

describe("鉄道", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("鉄道");
    });

    it("ボーナスとして工業系建造物x8点を得る", () => {
        const player: Player = {
            ...TestPlayerRed,
            buildings: [
                {card: "鉄道", workersOwner: []},
                {card: "工場", workersOwner: []},
                {card: "製鉄所", workersOwner: []},
                {card: "自動車工場", workersOwner: []},
                {card: "化学工場", workersOwner: []},
                {card: "農場", workersOwner: []}
            ]
        };

        assertBonus(playerAffected(BlankBed, player), 32);
    })
});