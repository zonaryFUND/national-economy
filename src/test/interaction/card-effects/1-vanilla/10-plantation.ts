import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { Game } from "model/protocol/game/game";
import { BlankBed, available, unavailable, assertAffect, TestPlayerRed, TestPlayerBlue } from "../../bed";

describe("大農園", () => {
    const plantation = cardEffect("大農園");

    it("任意の状態で使用可能", () => {
        available(BlankBed, plantation);
    });

    it("使用すると消費財を3枚引く", () => {
        assertAffect(BlankBed, plantation, [
            [
                "redが消費財を3枚引きました"
            ],
            {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    players: [
                        {
                            ...TestPlayerRed,
                            hand: ["消費財", "消費財", "消費財"]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ])
    });
});