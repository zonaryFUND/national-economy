import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { Player } from "model/protocol/game/player";
import { TestPlayerRed, available, BlankBed, unavailable, asyncResolveFail, assertAffectResolve, TestPlayerBlue } from "../../bed";
import { playerAffected } from "model/interaction/game/util";

describe("二胡市建設", () => {
    const doubleConstructor = cardEffect("二胡市建設");

    it("コスト(手札―2以下)が同じカードが手札に2枚以上あるとき使用可能", () => {
        const player: Player = {
            ...TestPlayerRed,
            hand: [
                "工場",
                "建設会社",
                "大農園",
                "自動車工場",
                "二胡市建設"                
            ]
        };
        available(playerAffected(BlankBed, player), doubleConstructor);
    });

    it("手札が空のとき使用不可能", () => {
        unavailable(BlankBed, doubleConstructor);
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
        unavailable(playerAffected(BlankBed, player), doubleConstructor);
    });

    it("コストが同じ手札が2枚以上ないとき使用不可能", () => {
        const player: Player = {
            ...TestPlayerRed,
            hand: [
                "農場",
                "工場",
                "大農園",
                "化学工場"
            ]
        };
        unavailable(playerAffected(BlankBed, player), doubleConstructor);
    });

    it("最小コストの同コスト手札2枚のコストを支払えるだけの手札がないとき使用不可能", () => {
        const player: Player = {
            ...TestPlayerRed,
            hand: [
                "農場",
                "工場",
                "大農園",
                "化学工場",
                "製鉄所"
            ]
        };
        unavailable(playerAffected(BlankBed, player), doubleConstructor);
    });

    it("使用して建設対象選択時に建設できないカードが含まれているとするとメッセージ", () => {
        const player: Player = {
            ...TestPlayerRed,
            hand: [
                "化学工場",
                "ゼネコン",
                "大農園",
                "消費財",
                "消費財",
                "消費財"
            ]
        };
        asyncResolveFail(playerAffected(BlankBed, player), doubleConstructor, {built: [0, 3]}, "建設できないカードが含まれています");
    });

    it("使用して建設対象のコストが異なっているとするとメッセージ", () => {
        const player: Player = {
            ...TestPlayerRed,
            hand: [
                "化学工場",
                "ゼネコン",
                "大農園",
                "消費財",
                "消費財",
                "消費財"
            ]
        };
        asyncResolveFail(playerAffected(BlankBed, player), doubleConstructor, {built: [1, 2]}, "建設できるのはコストが同じカード2枚です");
    });

    it("使用してコストが支払えないカードを建設しようとするとメッセージ", () => {
        const player: Player = {
            ...TestPlayerRed,
            hand: [
                "化学工場",
                "ゼネコン",
                "農場",
                "設計事務所"
            ]
        };
        asyncResolveFail(playerAffected(BlankBed, player), doubleConstructor, {built: [0, 1]}, "建設に必要なコストを支払えません");
    });

    it("使用して適切なカードを選択し、建設とコストとしての捨て札を行う", () => {
        const player: Player = {
            ...TestPlayerRed,
            hand: [
                "化学工場",
                "ゼネコン",
                "大農園",
                "消費財",
                "消費財",
                "消費財"
            ],
            buildings: [
                {card: "農場", workers: [{owner: "red", type: "human"}]}
            ]
        };
        assertAffectResolve(
            playerAffected(BlankBed, player), 
            doubleConstructor,
            {
                built: [0, 1],
                discard: [2, 3, 4, 5]
            },
            [
                [
                    "redが化学工場とゼネコンを建設しました",
                    "redが手札から大農園、消費財3枚を捨てました"
                ],
                {
                    ...BlankBed,
                    board: {
                        ...BlankBed.board,
                        trash: ["大農園"],
                        players: [
                            {
                                ...TestPlayerRed,
                                hand: [],
                                buildings: [
                                    {card: "農場", workers: [{owner: "red", type: "human"}]},
                                    {card: "化学工場", workers: []},
                                    {card: "ゼネコン", workers: []}
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