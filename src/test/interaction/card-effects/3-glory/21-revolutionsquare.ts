import "mocha";
import { assertUnavailable, assertBonus, BlankBed, TestPlayerRed } from "test/interaction/bed";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("革命広場", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("革命広場");
    });

    it("ボーナスとして人間の労働者が5人いるとき18点を得る", () => {
        const ngPlayer: Player = {
            ...TestPlayerRed, 
            buildings: [{card: "革命広場", workers: []}],
            workers: [{type: "human", fetched: true}, {type: "human", fetched: true}, {type: "human", fetched: true}, {type: "human", fetched: true}]
        };
        assertBonus(playerAffected(BlankBed, ngPlayer), 0);

        const ngPlayer2: Player = {
            ...TestPlayerRed, 
            buildings: [{card: "革命広場", workers: []}],
            workers: [{type: "human", fetched: true}, {type: "human", fetched: true}, {type: "human", fetched: true}, {type: "human", fetched: true}, {type: "automata", fetched: true}]
        };
        assertBonus(playerAffected(BlankBed, ngPlayer2), 0);

        const okPlayer: Player = {
            ...TestPlayerRed,
            buildings: [{card: "革命広場", workers: []}],
            workers: [{type: "human", fetched: true}, {type: "human", fetched: true}, {type: "human", fetched: true}, {type: "human", fetched: true}, {type: "human", fetched: true}]
        };
        assertBonus(playerAffected(BlankBed, okPlayer), 18);
    });
});