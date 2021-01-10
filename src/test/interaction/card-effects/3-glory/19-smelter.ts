import "mocha";
import assert from "power-assert";
import { cardEffect, AsyncCardEffect } from "model/interaction/game/card-effects";
import { BlankBed, available, unavailable, assertAffect, TestPlayerRed, TestPlayerBlue, assertAffectIO } from "../../bed";
import { Game, GameIO } from "model/protocol/game/game";
import { BuildRequest } from "model/interaction/game/async-command";

describe("精錬所", () => {
    const smelter = cardEffect("精錬所");
    const availableBed: Game = {...BlankBed, board: {...BlankBed.board, deck: ["ギルドホール", "ゲームカフェ", "モダニズム建設"]}};

    it("任意の状態で使用可能", () => {
        available(BlankBed, smelter);
    });

    it("使用すると3ドロー", () => {
        assertAffect(availableBed, smelter, [
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
                            hand: ["ギルドホール", "ゲームカフェ", "モダニズム建設"]
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
                    deck: ["モダニズム建設"],
                    trash: ["ギルドホール", "ゲームカフェ"]
                }
            },
            shuffle: array => array.reverse()
        };

        assertAffectIO(trashIO, smelter, [
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
                            hand: ["モダニズム建設", "ゲームカフェ", "ギルドホール"]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ]);
    });

    it("デッキ+捨て札の枚数が3未満のとき、不足分を消費財ドロー", () => {
        assertAffect(BlankBed, smelter, [
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

    it("3枚以上の勝利点トークンを所有していると建設コスト3、所有していないと建設コスト5", () => {
        const carpenter = cardEffect("大工") as AsyncCardEffect;
        const buildCommand = carpenter.command.name as BuildRequest;

        assert.equal(buildCommand.costCalclator("精錬所", 
        {...TestPlayerRed, victoryToken: 2}), 5, "通常コストが異なる");
        assert.equal(buildCommand.costCalclator("精錬所", 
        {...TestPlayerRed, victoryToken: 3}), 3, "軽減後コストが異なる");
    });
});