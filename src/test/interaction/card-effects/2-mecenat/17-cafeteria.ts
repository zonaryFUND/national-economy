import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { BlankBed, TestPlayerRed, available, unavailable, assertAffectResolve } from "test/interaction/bed";
import { Game } from "model/protocol/game/game";
import { playerAffected } from "model/interaction/game/util";

describe("食堂", () => {
    const cafeteria = cardEffect("食堂");
    const availableBed: Game = {
        ...BlankBed, 
        board: {
            ...BlankBed.board,
            houseHold: 10,
            players: {
                0: {
                    ...TestPlayerRed,
                    hand: ["消費財", "菜園"]
                }
            }
        }
    };

    it("手札が1枚上、家計が$8以上あるとき使用可能", () => {
        available(availableBed, cafeteria);
    });

    it("手札がないと使用不可能", () => {
        unavailable(playerAffected(availableBed, TestPlayerRed), cafeteria);
    });

    it("家計が$8未満だと使用不可能", () => {
        const bed = {
            ...availableBed,
            board: {
                ...availableBed.board,
                houseHold: 7
            }
        };
        unavailable(bed, cafeteria);
    });

    it("使用して捨て札を1枚選択し、家計から$8得る", () => {
        assertAffectResolve(
            availableBed,
            cafeteria,
            {targetHandIndices: [0]},
            [
                [
                    "redが手札から消費財1枚を捨てました",
                    "redが家計から$8を獲得しました"
                ],
                {
                    ...BlankBed,
                    board: {
                        ...BlankBed.board,
                        houseHold: 2,
                        players: {
                            0: {
                                ...TestPlayerRed,
                                hand: ["菜園"],
                                cash: 8
                            }
                        }
                    }
                }
            ]
        )
    });
});