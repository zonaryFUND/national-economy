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
                 {card: "投資銀行", workers: []},
                 {card: "旧市街", workers: []},
                 {card: "会計事務所", workers: []}
             ]
         };
         assertBonus(playerAffected(BlankBed, ngPlayer), 0);

         const okPlayer: Player = {
            ...TestPlayerRed,
            hand: ["投資銀行"],
            buildings: [
                {card: "投資銀行", workers: []},
                {card: "旧市街", workers: []},
                {card: "会計事務所", workers: []},
                {card: "墓地", workers: []}
            ]
        };
        assertBonus(playerAffected(BlankBed, okPlayer), 30);
    });
});