import { assertUnavailable, TestPlayerRed, assertBonus, BlankBed } from "../../bed";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("本社ビル", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("本社ビル");
    });

    it("ボーナスとして売却不可能建造物x6点を得る", () => {
        const player: Player = {
            ...TestPlayerRed,
            buildings: [
                {card: "本社ビル", workers: []},
                {card: "農協", workers: []},
                {card: "邸宅", workers: []},
                {card: "化学工場", workers: []},
            ]
        };

        assertBonus(playerAffected(BlankBed, player), 18);
    });
});