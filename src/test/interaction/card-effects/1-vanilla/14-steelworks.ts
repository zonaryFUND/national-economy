import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { BlankBed, available, unavailable, assertAffect, TestPlayerRed, TestPlayerBlue, assertAffectIO } from "../../bed";
import { Game, GameIO } from "model/protocol/game/game";

describe("製鉄所", () => {
    const steelworks = cardEffect("製鉄所");
    const availableBed: Game = {...BlankBed, board: {...BlankBed.board, deck: ["自動車工場", "農場", "邸宅"]}};

    it("任意の状態で使用可能", () => {
        available(BlankBed, steelworks);
    });

    it("使用すると3ドロー", () => {
        assertAffect(availableBed, steelworks, [
            [
                "redがカードを3枚引きました"
            ],
            {
                ...availableBed,
                board: {
                    ...availableBed.board,
                    deck: [],
                    players: [
                        {
                            ...TestPlayerRed,
                            hand: ["自動車工場", "農場", "邸宅"]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ]);
    });


    it("デッキ1枚、捨て札2枚で使用するとシャッフルして3ドロー", () => {
        const trashIO: GameIO = {
            game: {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    deck: ["邸宅"],
                    trash: ["ゼネコン", "レストラン"]
                }
            },
            shuffle: array => array.reverse()
        };

        assertAffectIO(trashIO, steelworks, [
            [
                "捨て札がシャッフルされ山札の下に補充されました",
                "redがカードを3枚引きました"
            ],
            {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    players: [
                        {
                            ...TestPlayerRed,
                            hand: ["邸宅", "レストラン", "ゼネコン"]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ]);
    });

    it("デッキ+捨て札の枚数が3未満のとき、不足分を消費財ドロー", () => {
        assertAffect(BlankBed, steelworks, [
            ["redが消費財を3枚引きました(山札、捨て札切れ)"],
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
        ]);
    });
});