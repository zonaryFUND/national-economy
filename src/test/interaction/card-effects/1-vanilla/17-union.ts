import { assertUnavailable, TestPlayerRed, assertBonus, BlankBed } from "../../bed";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("労働組合", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("労働組合");
    });

    it("ボーナスとして雇用された労働者x6点を得る", () => {
        const player: Player = {
            ...TestPlayerRed,
            workers: [{type: "human", fetched: true}, {type: "human", fetched: true}, {type: "human", fetched: true}, {type: "human", fetched: true}, {type: "human", fetched: true}],
            buildings: [{card: "労働組合", workers: []}]
        };

        assertBonus(playerAffected(BlankBed, player), 30);
    });
});
