import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { BlankBed, available, unavailable, assertAffect, TestPlayerRed, TestPlayerBlue, assertAffectIO, playerAffected } from "../../bed";
import { Game, GameIO } from "model/protocol/game/game";
import { Player } from "model/protocol/game/player";

describe("化学工場", () => {
    const chemicalFactory = cardEffect("化学工場");
    const twoDeckBed: Game = {...BlankBed, board: {...BlankBed.board, deck: ["自動車工場", "農場"]}};
    const fourDeckBed: Game = {...BlankBed, board: {...BlankBed.board, deck: ["自動車工場", "農場"], trash: ["本社ビル", "果樹園"]}};
    const oneHandPlayer: Player = {...TestPlayerRed, hand: ["焼畑"]};

    it("任意の状態で使用可能", () => {
        available(BlankBed, chemicalFactory);
    });

    it("手札1枚以上で使用すると2ドロー", () => {
        assertAffect(playerAffected(fourDeckBed, oneHandPlayer), chemicalFactory, [
            [
                "redがカードを2枚引きました"
            ],
            {
                ...fourDeckBed,
                board: {
                    ...fourDeckBed.board,
                    deck: [],
                    players: [
                        {
                            ...TestPlayerRed,
                            hand: ["焼畑", "自動車工場", "農場"]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ]);
    });

    it("手札0枚で使用すると4ドロー", () => {
        assertAffectIO({
            game: fourDeckBed,
            shuffle: array => array.reverse()
        }, chemicalFactory, [
            [
                "捨て札がシャッフルされ山札の下に補充されました",
                "redがカードを4枚引きました"
            ],
            {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    players: [
                        {
                            ...TestPlayerRed,
                            hand: ["自動車工場", "農場", "果樹園", "本社ビル"]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ])
    });

    it("手札0枚で使用すると4ドロー、不足分を消費財ドロー", () => {
        assertAffect(BlankBed, chemicalFactory, [
            ["redが消費財を4枚引きました(山札、捨て札切れ)"],
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
    });
});