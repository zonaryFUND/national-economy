import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { BlankBed, available, unavailable, assertAffect, TestPlayerRed, TestPlayerBlue, assertAffectIO } from "../../bed";
import { Game, GameIO } from "model/protocol/game/game";

describe("鉱山", () => {
    const mine = cardEffect("鉱山");

    it("任意の状態で使用可能", () => {
        available(BlankBed, mine);
    });

    const availableBed: Game = {...BlankBed, board: {...BlankBed.board, deck: ["自動車工場"]}};
    it("使用すると1ドロー", () => {
        assertAffect(availableBed, mine, [
            [
                "redがカードを1枚引きました"
            ],
            {
                ...availableBed,
                board: {
                    ...availableBed.board,
                    deck: [],
                    players: [
                        {
                            ...TestPlayerRed,
                            hand: ["自動車工場"]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ]);
    });

    it("デッキ0枚でスタートプレイヤーが使用すると消費財1ドロー", () => {
        assertAffect(BlankBed, mine, [
            [
                "redが消費財を1枚引きました(山札、捨て札切れ)", 
            ],
            {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    players: [
                        {
                            ...TestPlayerRed,
                            hand: ["消費財"]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ]);
    });

    it("デッキ0枚、捨て札1枚でスタートプレイヤーが使用するとシャッフルして1ドロー", () => {
        const trashIO: GameIO = {
            game: {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    trash: ["ゼネコン"]
                }
            },
            shuffle: array => array
        };

        assertAffectIO(trashIO, mine, [
            [
                "捨て札がシャッフルされ山札の下に補充されました",
                "redがカードを1枚引きました"
            ],
            {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    players: [
                        {
                            ...TestPlayerRed,
                            hand: ["ゼネコン"]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ]);
    });
});