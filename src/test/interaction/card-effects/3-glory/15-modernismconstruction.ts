import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { Player } from "model/protocol/game/player";
import { TestPlayerRed, available, BlankBed, unavailable, asyncResolveFail, assertAffectResolve, TestPlayerBlue } from "../../bed";
import { playerAffected } from "model/interaction/game/util";

describe("モダニズム建設", () => {
    const modernismConstruction = cardEffect("モダニズム建設");

    it("建設できる建物があるとき使用可能", () => {
        const player: Player = {
            ...TestPlayerRed,
            hand: [
                "炭鉱",
                "精錬所",
                "温室",
                "消費財"
            ]
        };
        available(playerAffected(BlankBed, player), modernismConstruction);

        const player2: Player = {
            ...TestPlayerRed,
            hand: [
                "記念碑",
                "炭鉱",
                "精錬所",
                "温室"
            ]
        };
        available(playerAffected(BlankBed, player2), modernismConstruction);
    });

    it("手札が空のとき使用不可能", () => {
        unavailable(BlankBed, modernismConstruction);
    })

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
        unavailable(playerAffected(BlankBed, player), modernismConstruction);
    });

    it("コストを支払える手札がないとき使用不可能", () => {
        const player: Player = {
            ...TestPlayerRed,
            hand: [
                "炭鉱",
                "精錬所",
                "消費財"
            ]
        };  
        unavailable(playerAffected(BlankBed, player), modernismConstruction);
    });

    it("使用して建設できないカードを建設しようとするとメッセージ", () => {
        const player: Player = {
            ...TestPlayerRed,
            hand: [
                "炭鉱",
                "精錬所",
                "温室",
                "消費財"
            ]
        };
        asyncResolveFail(playerAffected(BlankBed, player), modernismConstruction, {built: 3}, "そのカードは建設できません");
    });

    it("使用してコストが支払えないカードを建設しようとするとメッセージ", () => {
        const player: Player = {
            ...TestPlayerRed,
            hand: [
                "記念碑",
                "炭鉱",
                "精錬所",
                "温室",
                "消費財"
            ]
        };
        asyncResolveFail(playerAffected(BlankBed, player), modernismConstruction, {built: 3}, "建設に必要なコストを支払えません");
    });

    it("使用して適切なカードを選択し、建設とコストとしての捨て札を行う", () => {
        const player: Player = {
            ...TestPlayerRed,
            hand: [
                "炭鉱",
                "精錬所",
                "温室",
                "消費財"
            ]
        };
        assertAffectResolve(
            playerAffected(BlankBed, player), 
            modernismConstruction,
            {
                built: 0,
                discard: [1, 2, 3]
            },
            [
                [
                    "redが炭鉱を建設しました",
                    "redが手札から精錬所、温室、消費財1枚を捨てました"
                ],
                {
                    ...BlankBed,
                    board: {
                        ...BlankBed.board,
                        trash: ["精錬所", "温室"],
                        players: [
                            {
                                ...TestPlayerRed,
                                hand: [],
                                buildings: [
                                    {card: "炭鉱", workers: []}
                                ]
                            },
                            TestPlayerBlue
                        ]
                    }
                }
            ]
        );

        const player2: Player = {
            ...TestPlayerRed,
            hand: [
                "記念碑",
                "炭鉱",
                "精錬所",
                "温室",
                "消費財"
            ]
        };
        assertAffectResolve(
            playerAffected(BlankBed, player2), 
            modernismConstruction,
            {
                built: 0,
                discard: [1, 2, 3]
            },
            [
                [
                    "redが記念碑を建設しました",
                    "redが手札から炭鉱、精錬所、温室を捨てました"
                ],
                {
                    ...BlankBed,
                    board: {
                        ...BlankBed.board,
                        trash: ["炭鉱", "精錬所", "温室"],
                        players: [
                            {
                                ...TestPlayerRed,
                                hand: ["消費財"],
                                buildings: [
                                    {card: "記念碑", workers: []}
                                ]
                            },
                            TestPlayerBlue
                        ]
                    }
                }
            ]
        );
    });
});