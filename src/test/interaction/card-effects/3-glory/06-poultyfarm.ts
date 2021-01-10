import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { available, BlankBed, assertAffect, TestPlayerBlue, TestPlayerRed } from "test/interaction/bed";
import { playerAffected } from "model/interaction/game/util";

describe("養鶏場", () => {
    const poultryfarm = cardEffect("養鶏場");

    it("任意の状態で使用可能", () => {
        available(BlankBed, poultryfarm);
    });

    it("手札が偶数枚の状態で使用すると消費財を2枚引く", () => {
        assertAffect(BlankBed, poultryfarm, [
            ["redが消費財を2枚引きました"],
            {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    players: [
                        {
                            ...TestPlayerRed,
                            hand: ["消費財", "消費財"]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ]);
        assertAffect(playerAffected(BlankBed, {...TestPlayerRed, hand: ["温室", "炭鉱"]}), poultryfarm, [
            ["redが消費財を2枚引きました"],
            {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    players: {
                        0: {
                            ...TestPlayerRed,
                            hand: ["温室" , "炭鉱", "消費財", "消費財"]
                        },
                        1: TestPlayerBlue
                    }
                }
            }
        ]);
    });

    it("手札が奇数枚の状態で使用すると消費財を3枚引く", () => {
        assertAffect(playerAffected(BlankBed, {...TestPlayerRed, hand: ["消費財"]}), poultryfarm, [
            ["redが消費財を3枚引きました"],
            {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    players: [
                        {
                            ...TestPlayerRed,
                            hand: ["消費財", "消費財", "消費財", "消費財"]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ]);

        assertAffect(playerAffected(BlankBed, {...TestPlayerRed, hand: ["消費財", "炭鉱", "精錬所"]}), poultryfarm, [
            ["redが消費財を3枚引きました"],
            {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    players: [
                        {
                            ...TestPlayerRed,
                            hand: ["消費財", "炭鉱", "精錬所", "消費財", "消費財", "消費財"]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ]);
    });
});