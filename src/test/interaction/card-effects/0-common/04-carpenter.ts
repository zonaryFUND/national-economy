import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { Player } from "model/protocol/game/player";
import { TestPlayerRed, available, BlankBed, unavailable, asyncResolveFail, assertAffectResolve, TestPlayerBlue } from "../../bed";
import { playerAffected } from "model/interaction/game/util";

describe("大工", () => {
    const carpenter = cardEffect("大工");

    it("建設できる建物があるとき使用可能", () => {
        const player: Player = {
            ...TestPlayerRed,
            hand: [
                "農場",
                "消費財"
            ]
        };
        available(playerAffected(BlankBed, player), carpenter);
    });

    it("手札が空のとき使用不可能", () => {
        unavailable(BlankBed, carpenter);
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
        unavailable(playerAffected(BlankBed, player), carpenter);
    });

    it("コストを支払える手札がないとき使用不可能", () => {
        const player: Player = {
            ...TestPlayerRed,
            hand: [
                "化学工場",
                "ゼネコン",
                "大農園"
            ]
        };  
        unavailable(playerAffected(BlankBed, player), carpenter);
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
        asyncResolveFail(playerAffected(BlankBed, player), carpenter, {built: 3}, "そのカードは建設できません");
    });

    it("使用してコストが支払えないカードを建設しようとするとメッセージ", () => {
        const player: Player = {
            ...TestPlayerRed,
            hand: [
                "化学工場",
                "ゼネコン",
                "大農園",
                "自動車工場"
            ]
        };
        asyncResolveFail(playerAffected(BlankBed, player), carpenter, {built: 3}, "建設に必要なコストを支払えません");
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
            carpenter,
            {
                built: 2,
                discard: [0, 1, 3]
            },
            [
                [
                    "redが大農園を建設しました",
                    "redが手札から化学工場、ゼネコン、消費財1枚を捨てました"
                ],
                {
                    ...BlankBed,
                    board: {
                        ...BlankBed.board,
                        trash: ["化学工場", "ゼネコン"],
                        players: [
                            {
                                ...TestPlayerRed,
                                hand: [],
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