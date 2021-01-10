import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { Game } from "model/protocol/game/game";
import { BlankBed, TestPlayerRed, available, unavailable, assertAffect, TestPlayerBlue } from "test/interaction/bed";

describe("美術館", () => {
    const museum = cardEffect("美術館");

    const notFiveHandAvailableBed: Game = {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            houseHold: 7
        }
    };

    it("手札が5枚でない場合、$7が家計にあれば使用可能", () => {
        available(notFiveHandAvailableBed, museum);
    });

    it("手札が5枚でない場合、$7が家計にないと使用不可能", () => {
        unavailable({
            ...notFiveHandAvailableBed,
            board: {
                ...notFiveHandAvailableBed.board,
                houseHold: 6
            }
        }, museum);
    });

    it("手札が5枚でない場合に使用すると$7を家計から得る", () => {
        assertAffect(notFiveHandAvailableBed, museum, [
            ["redが家計から$7を獲得しました"],
            {
                ...notFiveHandAvailableBed,
                board: {
                    ...notFiveHandAvailableBed.board,
                    houseHold: 0,
                    players: [
                        {
                            ...TestPlayerRed,
                            cash: 7
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ]);
    });

    const fiveHandAvailableBed: Game = {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            houseHold: 14,
            players: [
                {
                    ...TestPlayerRed,
                    hand: ["綿花農場", "蒸気工場", "消費財", "温室", "炭鉱"]
                },
                TestPlayerBlue
            ]
        }
    };

    it("手札が5枚の場合、$14が家計にあれば使用可能", () => {
        available(fiveHandAvailableBed, museum);
    });

    it("手札が5枚の場合、$14が家計にないと使用不可能", () => {
        unavailable({
            ...fiveHandAvailableBed,
            board: {
                ...fiveHandAvailableBed.board,
                houseHold: 13
            }
        }, museum);
    });

    it("手札が5枚の場合に使用すると$14を家計から得る", () => {
        assertAffect(fiveHandAvailableBed, museum, [
            ["redが家計から$14を獲得しました"],
            {
                ...fiveHandAvailableBed,
                board: {
                    ...fiveHandAvailableBed.board,
                    houseHold: 0,
                    players: [
                        {
                            ...TestPlayerRed,
                            hand: ["綿花農場", "蒸気工場", "消費財", "温室", "炭鉱"],
                            cash: 14
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ]);
    });
});