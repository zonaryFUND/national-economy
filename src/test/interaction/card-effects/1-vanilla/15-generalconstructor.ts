import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { Game, GameIO } from "model/protocol/game/game";
import { BlankBed, TestPlayerRed, TestPlayerBlue, available, unavailable, asyncResolveFail, assertAffectIOResolve } from "../../bed";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("ゼネコン", () => {
    const generalConstructor = cardEffect("ゼネコン");
    const availableBed: Game = {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            deck: ["不動産屋"],
            players: [
                {
                    ...TestPlayerRed,
                    hand: ["消費財", "大農園", "農場"]
                },
                TestPlayerBlue
            ]
        }
    };

    it("建設できる建物があるとき使用可能", () => {
        available(availableBed, generalConstructor);
    });

    it("手札が空のとき使用不可能", () => {
        unavailable(BlankBed, generalConstructor);
    });

    it("消費財しかないとき使用不可能", () => {
        const player: Player = {
            ...TestPlayerRed,
            hand: [
                "消費財",
                "消費財",
                "消費財",
                "消費財",
                "消費財",
                "消費財"
            ]
        };
        unavailable(playerAffected(BlankBed, player), generalConstructor);
    });

    it("コストを支払える手札がないとき使用不可能", () => {
        unavailable({
            ...BlankBed,
            board: {
                ...BlankBed.board,
                deck: ["大農園", "工場"],
                players: [
                    {
                        ...TestPlayerRed,
                        hand: [
                            "工場",
                            "本社ビル"
                        ]
                    },
                    TestPlayerBlue
                ]
            }
        }, generalConstructor)
    });

    it("使用して建設できないカードを建設しようとするとメッセージ", () => {
        const player: Player = {
            ...TestPlayerRed,
            hand: [
                "化学工場",
                "ゼネコン",
                "大農園",
                "消費財"
            ]
        };
        asyncResolveFail({
            ...BlankBed,
            board: {
                ...BlankBed.board,
                deck: ["農場", "邸宅"],
                players: [player, TestPlayerBlue]
            }
        }, generalConstructor, {built: 3}, "そのカードは建設できません");
    });

    it("使用してコストが支払えないカードを建設しようとするとメッセージ", () => {
        asyncResolveFail({
            ...BlankBed,
            board: {
                ...BlankBed.board,
                deck: ["本社ビル", "果樹園"],
                players: [
                    {
                        ...TestPlayerRed,
                        hand: ["果樹園", "自動車工場", "農場"]
                    },
                    TestPlayerBlue
                ]
            }
        }, generalConstructor, {built: 1}, "建設に必要なコストを支払えません");
    });

    it("使用して適切なカードを選択し、建設と捨て札を行ったあとカードを2枚引く", () => {
        const io: GameIO = {
            game: {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    players: [
                        {
                            ...TestPlayerRed,
                            hand: ["消費財", "農場", "工場", "自動車工場"]
                        },
                        TestPlayerBlue
                    ]
                }
            },
            shuffle: array => array.reverse()
        }

        assertAffectIOResolve(io, generalConstructor, {built: 2, discard: [1, 3]}, [
            [
                "redが工場を建設しました",
                "redが手札から農場、自動車工場を捨てました",
                "捨て札がシャッフルされ山札の下に補充されました",
                "redがカードを2枚引きました"
            ],
            {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    players: [
                        {
                            ...TestPlayerRed,
                            hand: ["消費財", "自動車工場", "農場"],
                            buildings: [{card: "工場", workers: []}]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ])
    });
});