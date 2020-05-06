import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { Game } from "model/protocol/game/game";
import { BlankBed, TestPlayerRed, available, unavailable, assertAffectResolve } from "test/interaction/bed";
import { playerAffected } from "model/interaction/game/util";

describe("遊園地", () => {
    const amusementpark = cardEffect("遊園地");
    const availableBed: Game = {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            houseHold: 30,
            players: {
                0: {
                    ...TestPlayerRed,
                    hand: ["消費財", "養殖場"]
                }
            }
        }
    };

    it("手札が2枚以上、家計が$25以上あるとき使用可能", () => {
        available(availableBed, amusementpark);
    });

    it("手札がないと使用不可能", () => {
        unavailable(playerAffected(availableBed, TestPlayerRed), amusementpark);
    });

    it("家計が$25未満だと使用不可能", () => {
        const bed = {
            ...availableBed,
            board: {
                ...availableBed.board,
                houseHold: 24
            }
        };
        unavailable(bed, amusementpark);
    });

    it("使用して捨て札を2枚選択し、家計から$25得る", () => {
        assertAffectResolve(
            availableBed,
            amusementpark,
            {
                targetHandIndices: [0, 1]
            },
            [
                [
                    "redが手札から養殖場、消費財1枚を捨てました",
                    "redが家計から$25を獲得しました"
                ],
                {

                    ...BlankBed,
                    board: {
                        ...BlankBed.board,
                        houseHold: 5,
                        trash: ["養殖場"],
                        players: {
                            0: {
                                ...TestPlayerRed,
                                cash: 25
                            }
                        }
                    }
                }
            ]
        )
    });
});