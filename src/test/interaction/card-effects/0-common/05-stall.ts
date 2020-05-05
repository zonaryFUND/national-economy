import "mocha";
import { Game } from "model/protocol/game/game";
import { BlankBed, TestPlayerRed, TestPlayerBlue, available, unavailable, assertAffectResolve } from "../../bed";
import { cardEffect } from "model/interaction/game/card-effects";
import { playerAffected } from "model/interaction/game/util";

describe("露店", () => {
    const stall = cardEffect("露店");
    const availableBed: Game =  {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            houseHold: 10,
            players: [
                {
                    ...TestPlayerRed,
                    hand: ["消費財", "農場"]
                },
                TestPlayerBlue
            ]
        }
    };

    it("手札が1枚以上、家計が$6以上あるとき使用可能", () => {
        available(availableBed, stall);
    });

    it("手札がないと使用不可能", () => {
        unavailable(playerAffected(availableBed, TestPlayerRed), stall);
    });

    it("家計が$6未満だと使用不可能", () => {
        const bed = {
            ...availableBed,
            board: {
                ...availableBed.board,
                houseHold: 5
            }
        };
        unavailable(bed, stall);
    });

    it("使用して捨て札を1枚選択し、家計から$6得る", () => {
        assertAffectResolve(
            availableBed, 
            stall,
            {
                targetHandIndices: [0]
            },
            [
                [
                    "redが手札から消費財1枚を捨てました",
                    "redが家計から$6を獲得しました"
                ],
                {
                    ...BlankBed,
                    board: {
                        ...BlankBed.board,
                        houseHold: 4,
                        players: [
                            {
                                ...TestPlayerRed,
                                hand: ["農場"],
                                cash: 6
                            },
                            TestPlayerBlue
                        ]
                    }
                }
            ]
        );
    });

});