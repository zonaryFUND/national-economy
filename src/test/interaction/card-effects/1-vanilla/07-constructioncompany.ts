import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { Player } from "model/protocol/game/player";
import { TestPlayerRed, available, playerAffected, BlankBed, unavailable, asyncResolveFail, assertAffectResolve, TestPlayerBlue } from "../../bed";

describe("建設会社", () => {
    const constructionCompany = cardEffect("建設会社");

    it("建設できる建物があるとき使用可能", () => {
        const player: Player = {
            ...TestPlayerRed,
            hand: [
                "農場"
            ]
        };
        available(playerAffected(BlankBed, player), constructionCompany);
    });

    it("手札が空のとき使用不可能", () => {
        unavailable(BlankBed, constructionCompany);
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
        unavailable(playerAffected(BlankBed, player), constructionCompany);
    });

    it("コストを支払える手札がないとき使用不可能", () => {
        const player: Player = {
            ...TestPlayerRed,
            hand: [
                "化学工場",
                "ゼネコン"
            ]
        };  
        unavailable(playerAffected(BlankBed, player), constructionCompany);
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
        asyncResolveFail(playerAffected(BlankBed, player), constructionCompany, {built: 3}, "そのカードは建設できません");
    });

    it("使用してコストが支払えないカードを建設しようとするとメッセージ", () => {
        const player: Player = {
            ...TestPlayerRed,
            hand: [
                "化学工場",
                "ゼネコン",
                "大農園"
            ]
        };
        asyncResolveFail(playerAffected(BlankBed, player), constructionCompany, {built: 1}, "建設に必要なコストを支払えません");
    });

    it("使用して適切なカードを選択し、建設とコストとしての捨て札を行う", () => {
        const player: Player = {
            ...TestPlayerRed,
            hand: [
                "化学工場",
                "ゼネコン",
                "大農園",
                "消費財"
            ],
            buildings: [
                {card: "農場", workersOwner: ["red"]}
            ]
        };
        assertAffectResolve(
            playerAffected(BlankBed, player), 
            constructionCompany,
            {
                built: 2,
                discard: [1, 3]
            },
            [
                [
                    "redが大農園を建設しました",
                    "redが手札からゼネコン、消費財1枚を捨てました"
                ],
                {
                    ...BlankBed,
                    board: {
                        ...BlankBed.board,
                        trash: ["ゼネコン"],
                        players: [
                            {
                                ...TestPlayerRed,
                                hand: ["化学工場"],
                                buildings: [
                                    {card: "農場", workersOwner: ["red"]},
                                    {card: "大農園", workersOwner: []}
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