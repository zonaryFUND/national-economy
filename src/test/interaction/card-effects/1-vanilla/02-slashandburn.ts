import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { Game } from "model/protocol/game/game";
import { BlankBed, available, unavailable, assertAffect, TestPlayerRed, TestPlayerBlue } from "../../bed";

describe("", () => {
    const slashandburn = cardEffect("焼畑", 1);
    const availableBed: Game = {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            players: [
                {
                    ...TestPlayerRed,
                    buildings: [{card: "レストラン", workers: [{owner: "red", type: "human"}]}, {card: "焼畑", workers: []}]
                },
                TestPlayerBlue
            ]
        }
    };

    it("任意の状態で使用可能", () => {
        available(availableBed, slashandburn);
    });

    it("使用すると消費財を5枚引き、焼畑を捨て札にする", () => {
        assertAffect(availableBed, slashandburn, [
            [
                "redが消費財を5枚引きました",
                "redの私有建造物であった焼畑が捨て札になりました"
            ],
            {
                ...availableBed,
                board: {
                    ...availableBed.board,
                    trash: ["焼畑"],
                    players: [
                        {
                            ...TestPlayerRed,
                            hand: ["消費財", "消費財", "消費財", "消費財", "消費財"],
                            buildings: [{card: "レストラン", workers: [{owner: "red", type: "human"}]}]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ])
    });
});