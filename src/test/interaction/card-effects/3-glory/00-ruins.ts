import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { available, BlankBed, assertAffect, TestPlayerBlue, TestPlayerRed } from "test/interaction/bed";

describe("遺跡", () => {
    const ruins = cardEffect("遺跡");
    
    it("任意の状態で使用可能", () => {
        available(BlankBed, ruins);
    });

    it("使用すると消費財を1枚引き勝利点トークンを1枚得る", () => {
        assertAffect(BlankBed, ruins, [
            [
                "redが消費財を1枚引きました",
                "redが勝利点トークンを1つ獲得しました"
            ],
            {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    players: [
                        {
                            ...TestPlayerRed,
                            hand: ["消費財"],
                            victoryToken: 1
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ])
    });
});