import { assertUnavailable, TestPlayerRed, assertBonus, BlankBed } from "../../bed";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("法律事務所", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("法律事務所");
    });

    it("未払い賃金があるとき、それを未払い$5ぶんまで軽減するボーナススコアを与える", () => {
        const player: Player = {
            ...TestPlayerRed,
            penalty: 10,
            buildings: [
                {card: "法律事務所", workers: []}
            ]
        };

        assertBonus(playerAffected(BlankBed, player), 15);
    });
});