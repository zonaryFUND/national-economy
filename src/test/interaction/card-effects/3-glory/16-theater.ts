import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { Game } from "model/protocol/game/game";
import { BlankBed, TestPlayerRed, available, unavailable, assertAffectResolve } from "test/interaction/bed";
import { playerAffected } from "model/interaction/game/util";

describe("劇場", () => {
    const theater = cardEffect("劇場");
    const availableBed: Game = {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            houseHold: 20,
            players: {
                0: {
                    ...TestPlayerRed,
                    hand: ["消費財", "転送装置"]
                }
            }
        }
    };

    it("手札が2枚以上、家計が$20以上あるとき使用可能", () => {
        available(availableBed, theater);
    });

    it("手札がないと使用不可能", () => {
        unavailable(playerAffected(availableBed, TestPlayerRed), theater);
    });

    it("家計が$20未満だと使用不可能", () => {
        const bed = {
            ...availableBed,
            board: {
                ...availableBed.board,
                houseHold: 19
            }
        };
        unavailable(bed, theater);
    });

    it("使用して捨て札を2枚選択し、家計から$20得る", () => {
        assertAffectResolve(
            availableBed,
            theater,
            {
                targetHandIndices: [0, 1]
            },
            [
                [
                    "redが手札から転送装置、消費財1枚を捨てました",
                    "redが家計から$20を獲得しました"
                ],
                {

                    ...BlankBed,
                    board: {
                        ...BlankBed.board,
                        houseHold: 0,
                        trash: ["転送装置"],
                        players: {
                            0: {
                                ...TestPlayerRed,
                                cash: 20
                            }
                        }
                    }
                }
            ]
        )
    });
});