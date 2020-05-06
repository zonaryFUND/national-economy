import "mocha";
import { assertUnavailable, TestPlayerRed, assertBonus, BlankBed } from "test/interaction/bed";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("鉄道駅", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("鉄道駅");  
    });

    it("ボーナスとして建物が6つ以上あるとき18点を得る", () => {
        const ngPlayer: Player = {
            ...TestPlayerRed,
            buildings: [
                {card: "鉄道駅", workersOwner: []},
                {card: "宝くじ", workersOwner: []},
                {card: "宝くじ", workersOwner: []},
                {card: "宝くじ", workersOwner: []},
                {card: "宝くじ", workersOwner: []}
            ]
        };
        assertBonus(playerAffected(BlankBed, ngPlayer), 0);

        const okPlayer: Player = {
            ...TestPlayerRed,
            buildings: [
                {card: "鉄道駅", workersOwner: []},
                {card: "宝くじ", workersOwner: []},
                {card: "宝くじ", workersOwner: []},
                {card: "宝くじ", workersOwner: []},
                {card: "宝くじ", workersOwner: []},
                {card: "宝くじ", workersOwner: []}
            ]
        };
        assertBonus(playerAffected(BlankBed, okPlayer), 18);
    });
});