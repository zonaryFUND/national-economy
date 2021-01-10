import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { Game } from "model/protocol/game/game";
import { BlankBed, available, unavailable, assertAffect, TestPlayerBlue, TestPlayerRed } from "test/interaction/bed";

describe("ゲームカフェ", () => {
    const gamecafe = cardEffect("ゲームカフェ");

    const notLastBed: Game = {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            houseHold: 5
        }
    };
    it("最終手番でないなら家計が$5以上あるとき使用可能", () => {
        available(notLastBed, gamecafe);
    });

    it("最終手番でないなら家計が$5ないとき使用不可能", () => {
        unavailable({
            ...notLastBed,
            board: {
                ...notLastBed.board,
                houseHold: 4
            }
        }, gamecafe);
    });

    it("最終手番以外で使用すると家計から$5得る", () => {
        assertAffect(notLastBed, gamecafe, [
            [
                "redが家計から$5を獲得しました",
            ],
            {
                ...notLastBed,
                board: {
                    ...notLastBed.board,
                    houseHold: 0,
                    players: [
                        {    
                            ...TestPlayerRed,
                            cash: 5
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ]);
    });

    const lastBed: Game = {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            houseHold: 10,
            players: [
                {
                    ...TestPlayerRed,
                    workers: [{type: "human", fetched: true}, {type: "human", fetched: true}, {type: "training-human", fetched: false}]
                },
                TestPlayerBlue
            ]
        }
    };

    it("最終手番なら家計が$10以上あるとき使用可能", () => {
        available(lastBed, gamecafe);
    });

    it("最終手番なら家計が$10ないとき使用不可能", () => {
        unavailable({
            ...lastBed,
            board: {
                ...lastBed.board,
                houseHold: 9
            }
        }, gamecafe);
    });

    it("最終手番で使用すると家計から$10得る", () => {
        assertAffect(lastBed, gamecafe, [
            [
                "redが家計から$10を獲得しました",
            ],
            {
                ...lastBed,
                board: {
                    ...lastBed.board,
                    houseHold: 0,
                    players: [
                        {    
                            ...lastBed.board.players[0],
                            cash: 10
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ]);
    });
});