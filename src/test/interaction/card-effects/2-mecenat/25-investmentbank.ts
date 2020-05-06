import "mocha";
import { assertUnavailable, TestPlayerRed, assertBonus, BlankBed } from "test/interaction/bed";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("投資銀行", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("投資銀行");
    });

    it("ボーナスとして売却不可能系建造物を4つ以上所有していれば30点を得る", () => {
         const ngPlayer: Player = {
             ...TestPlayerRed,
             buildings: [
                 {card: "投資銀行", workersOwner: []},
                 {card: "旧市街", workersOwner: []},
                 {card: "会計事務所", workersOwner: []}
             ]
         };
         assertBonus(playerAffected(BlankBed, ngPlayer), 0);

         const okPlayer: Player = {
            ...TestPlayerRed,
            hand: ["投資銀行"],
            buildings: [
                {card: "投資銀行", workersOwner: []},
                {card: "旧市街", workersOwner: []},
                {card: "会計事務所", workersOwner: []},
                {card: "墓地", workersOwner: []}
            ]
        };
        assertBonus(playerAffected(BlankBed, okPlayer), 30);
    });
});