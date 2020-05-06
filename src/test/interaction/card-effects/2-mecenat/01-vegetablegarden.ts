import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { available, BlankBed, assertAffect, TestPlayerRed } from "test/interaction/bed";
import { playerAffected } from "model/interaction/game/util";

describe("菜園", () => {
    const vegetablegarden = cardEffect("菜園");

    it("任意の状態で使用可能", () => {
        available(BlankBed, vegetablegarden); 
    });

    it("使用すると消費財を2枚、勝利点トークンを1枚引く", () => {
        assertAffect(BlankBed, vegetablegarden, [
            [
                "redが消費財を2枚引きました",
                "redが勝利点トークンを1つ獲得しました"
            ],
            playerAffected(BlankBed, {
                ...TestPlayerRed,
                hand: ["消費財", "消費財"],
                victoryToken: 1
            })
        ]);
    });
});