import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { BlankBed, TestPlayerRed, available, TestPlayerBlue, unavailable, assertAffectIOResolve, asyncResolveFail } from "../../bed";
import { Player } from "model/protocol/game/player";
import { Game, GameIO } from "model/protocol/game/game";

describe("工場", () => {
    const factory = cardEffect("工場");
    const threeHandPlayer: Player = {...TestPlayerRed, hand: ["不動産屋", "化学工場", "消費財"]};
    const availableBed: Game = {
        ...BlankBed, 
        board: {
            ...BlankBed.board, 
            deck: ["焼畑", "珈琲店"],
            players: [threeHandPlayer, TestPlayerBlue]
        }
    };

    it("手札2枚以上で使用可能", () => {
        available(availableBed, factory);
        available({
            ...availableBed,
            board: {
                ...availableBed.board,
                deck: ["社宅"],
                trash: ["自動車工場"]
            }
        }, factory);
    });

    it("手札2枚未満で使用不可能", () => {
        unavailable({
            ...availableBed,
            board: {...availableBed.board, players: [TestPlayerRed, TestPlayerBlue]}
        }, factory);
    });

    it("使用して捨て札を2枚選択し、カードを4枚引く", () => {
        const io: GameIO = {
            game: availableBed,
            shuffle: array => array.reverse()
        };

        assertAffectIOResolve(io, factory, {targetHandIndices: [0, 1]}, [
            [
                "redが手札から不動産屋、化学工場を捨てました",
                "捨て札がシャッフルされ山札の下に補充されました",
                "redがカードを4枚引きました"
            ],
            {
                ...availableBed,
                board: {
                    ...availableBed.board,
                    deck: [],
                    trash: [],
                    players: [
                        {
                            ...threeHandPlayer,
                            hand: ["消費財", "焼畑", "珈琲店", "化学工場", "不動産屋"]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ])
    });

    it("使用して捨て札を2枚選択し、カードを4枚引く(山札+捨て札が1枚以下なので消費財で埋める)", () => {
        const io: GameIO = {
            game: {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    trash: ["倉庫"],
                    players: [threeHandPlayer, TestPlayerBlue]
                },
            },
            shuffle: array => array.reverse()
        };

        assertAffectIOResolve(io, factory, {targetHandIndices: [0, 1]}, [
            [
                "redが手札から不動産屋、化学工場を捨てました",
                "捨て札がシャッフルされ山札の下に補充されました",
                "redがカードを3枚、消費財を1枚引きました(山札、捨て札切れ)"
            ],
            {
                ...availableBed,
                board: {
                    ...availableBed.board,
                    deck: [],
                    trash: [],
                    players: [
                        {
                            ...threeHandPlayer,
                            hand: ["消費財", "化学工場", "不動産屋", "倉庫", "消費財"]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ])
    });
});