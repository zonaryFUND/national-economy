import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { Game } from "model/protocol/game/game";
import { BlankBed, TestPlayerRed, available, unavailable, assertAffect } from "test/interaction/bed";
import { playerAffected } from "model/interaction/game/util";

describe("観光牧場", () => {
    const touristranch = cardEffect("観光牧場");

    const availableBed: Game = {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            houseHold: 12,
            players: {
                0: {
                    ...TestPlayerRed,
                    hand: ["鉄道駅", "消費財", "消費財"]
                }
            }
        }
    };
    it("手札に消費財があるとき使用可能", () => {
        available(availableBed, touristranch);
    });

    it("手札に消費財がないとき使用不可能", () => {
        const bed: Game = {
            ...BlankBed,
            board: {
                ...BlankBed.board,
                houseHold: 20,
                players: {
                    0: {
                        ...TestPlayerRed,
                        hand: ["石油コンビナート", "芋畑", "造船所"]
                    }
                }
            }
        };
        unavailable(bed, touristranch);
    });

    it("手札の消費財x$4が家計にないと使用不可能", () => {
        const bed: Game = {
            ...availableBed,
            board: {
                ...availableBed.board,
                houseHold: 7
            }
        };
        unavailable(bed, touristranch);
    });

    it("使用すると手札の消費財1枚につき$4を家計から得る", () => {
        assertAffect(availableBed, touristranch, [
            ["redが家計から$8を獲得しました"],
            {
                ...availableBed,
                board: {
                    ...availableBed.board,
                    houseHold: 4,
                    players: {
                        0: {
                            ...availableBed.board.players[0],
                            cash: 8
                        }
                    }
                }
            }
        ]);
    });
});