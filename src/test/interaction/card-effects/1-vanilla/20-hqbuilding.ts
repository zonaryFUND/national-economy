import { assertUnavailable, TestPlayerRed, assertBonus, playerAffected, BlankBed } from "../../bed";
import { Player } from "model/protocol/game/player";

describe("本社ビル", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("本社ビル");
    });

    it("ボーナスとして売却不可能建造物x6点を得る", () => {
        const player: Player = {
            ...TestPlayerRed,
            buildings: [
                {card: "本社ビル", workersOwner: []},
                {card: "農協", workersOwner: []},
                {card: "邸宅", workersOwner: []},
                {card: "化学工場", workersOwner: []},
            ]
        };

        assertBonus(playerAffected(BlankBed, player), 18);
    });
});