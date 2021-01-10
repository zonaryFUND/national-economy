import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { Game } from "model/protocol/game/game";
import { playerAffected } from "model/interaction/game/util";
import { BlankBed, TestPlayerRed, available, unavailable, asyncResolveFail, assertAffectResolve, TestPlayerBlue } from "test/interaction/bed";

describe("植民団", () => {
    const colony = cardEffect("植民団");

    const availableBed: Game = playerAffected(BlankBed, {
        ...TestPlayerRed,
        hand: ["農村", "機械人形", "精錬所", "消費財"]
    });
    it("建設できる建物があるとき使用可能", () => {
        available(availableBed, colony);
    });

    it("手札が空のとき使用不可能", () => {
        unavailable(BlankBed, colony); 
    });

    it("消費財しかないとき使用不可能", () => {
        unavailable(playerAffected(BlankBed, {
            ...TestPlayerRed,
            hand: [
                "消費財",
                "消費財",
                "消費財",
                "消費財",
                "消費財"
            ]
        }), colony);
    });

    it("コストを支払える手札がないとき使用不可能", () => {
        unavailable(playerAffected(BlankBed, {
            ...TestPlayerRed,
            hand: [
                "機械人形",
                "精錬所",
                "消費財"
            ]
        }), colony);
    });

    it("使用して建設できないカードを建設しようとするとメッセージ", () => {
        asyncResolveFail(availableBed, colony, {built: 3}, "そのカードは建設できません");
    });

    it("使用してコストが支払えないカードを建設しようとするとメッセージ", () => {
        asyncResolveFail(availableBed, colony, {built: 1}, "建設に必要なコストを支払えません");1
    });

    it("使用して適切なカードを選択し、建設とコストとしての捨て札を行った後、消費財を1枚引く", () => {
        assertAffectResolve(availableBed, colony, {built: 0, discard: [0]}, [
            [
                "redが農村を建設しました",
                "redが手札から機械人形を捨てました",
                "redが消費財を1枚引きました"
            ],
            {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    trash: ["機械人形"],
                    players: [
                        {
                            ...TestPlayerRed,
                            hand: ["精錬所", "消費財", "消費財"],
                            buildings: [{card: "農村", workers: []}]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ]);
    });
});