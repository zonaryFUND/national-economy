import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { available, BlankBed, assertAffect, TestPlayerBlue, TestPlayerRed } from "test/interaction/bed";
import { playerAffected } from "model/interaction/game/util";

describe("養殖場", () => {
    const nursery = cardEffect("養殖場");

    it("任意の状態で使用可能", () => {
        available(BlankBed, nursery);
    });

    it("手札に消費財がない状態で使用すると消費財を2枚引く", () => {
        assertAffect(playerAffected(BlankBed, {...TestPlayerRed, hand: ["芋畑", "観光牧場"]}), nursery, [
            ["redが消費財を2枚引きました"],
            {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    players: {
                        0: {
                            ...TestPlayerRed,
                            hand: ["芋畑" , "観光牧場", "消費財", "消費財"]
                        },
                        1: TestPlayerBlue
                    }
                }
            }
        ])
    });

    it("手札に消費財がある状態で使用すると消費財を3枚引く", () => {
        assertAffect(playerAffected(BlankBed, {...TestPlayerRed, hand: ["消費財"]}), nursery, [
            ["redが消費財を3枚引きました"],
            {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    players: {
                        0: {
                            ...TestPlayerRed,
                            hand: ["消費財", "消費財", "消費財", "消費財"]
                        },
                        1: TestPlayerBlue
                    }
                }
            }
        ])
    });
});