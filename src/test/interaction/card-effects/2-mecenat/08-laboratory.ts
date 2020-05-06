import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { available, BlankBed, assertAffect, TestPlayerBlue, TestPlayerRed } from "test/interaction/bed";
import { playerAffected } from "model/interaction/game/util";

describe("研究所", () => {
    const laboratory = cardEffect("研究所");

    it("任意の状態で使用可能", () => {
        available(BlankBed, laboratory);
    });

    it("使用するとカードを2枚、勝利点トークンを1枚引く", () => {
        assertAffect({
            ...BlankBed,
            board: {
                ...BlankBed.board,
                deck: ["プレハブ工務店", "会計事務所"]
            }
        }, laboratory, [
            [
                "redがカードを2枚引きました",
                "redが勝利点トークンを1つ獲得しました"
            ],
            playerAffected(BlankBed, {
                ...TestPlayerRed,
                hand: ["プレハブ工務店", "会計事務所"],
                victoryToken: 1
            })
        ]);
    });
});