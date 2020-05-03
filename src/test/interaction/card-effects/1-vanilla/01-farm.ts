import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { Game } from "model/protocol/game/game";
import { BlankBed, available, unavailable, assertAffect, TestPlayerRed, TestPlayerBlue } from "../../bed";

describe("農場", () => {
    const farm = cardEffect("農場");

    it("任意の状態で使用可能", () => {
        available(BlankBed, farm);
    });

    it("使用すると消費財を2枚引く", () => {
        assertAffect(BlankBed, farm, [
            [
                "redが消費財を2枚引きました"
            ],
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
        ])
    });
});