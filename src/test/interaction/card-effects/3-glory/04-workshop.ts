import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { available, BlankBed, assertAffect, TestPlayerRed, TestPlayerBlue } from "test/interaction/bed";
import { Game } from "model/protocol/game/game";

describe("工房", () => {
    const workshop = cardEffect("工房");

    it("任意の状態で使用可能", () => {
        available(BlankBed, workshop); 
    });

    it("使用するとカードを1枚、勝利点トークンを1枚引く", () => {
        const bed: Game = {
            ...BlankBed,
            board: {
                ...BlankBed.board,
                deck: ["農村", "遺物", "精錬所"]
            }
        }
        assertAffect(bed, workshop, [
            [
                "redがカードを1枚引きました",
                "redが勝利点トークンを1つ獲得しました"
            ],
            {
                ...bed,
                board: {
                    ...bed.board,
                    deck: ["遺物", "精錬所"],
                    players: [
                        {
                            ...TestPlayerRed,
                            hand: ["農村"],
                            victoryToken: 1
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ]);
    });
});