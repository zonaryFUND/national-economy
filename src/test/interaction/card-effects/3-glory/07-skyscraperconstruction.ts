import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { Game } from "model/protocol/game/game";
import { playerAffected } from "model/interaction/game/util";
import { BlankBed, TestPlayerRed, available, unavailable, asyncResolveFail, assertAffectResolve, TestPlayerBlue } from "test/interaction/bed";

describe("摩天建設", () => {
    const skyscraperConstruction = cardEffect("摩天建設");

    const availableBed: Game = playerAffected(BlankBed, {
        ...TestPlayerRed,
        hand: ["農村", "機械人形", "精錬所", "消費財"]
    });
    it("建設できる建物があるとき使用可能", () => {
        available(availableBed, skyscraperConstruction);
    });

    it("手札が空のとき使用不可能", () => {
        unavailable(BlankBed, skyscraperConstruction); 
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
        }), skyscraperConstruction);
    });

    it("コストを支払える手札がないとき使用不可能", () => {
        unavailable(playerAffected(BlankBed, {
            ...TestPlayerRed,
            hand: [
                "機械人形",
                "精錬所",
                "消費財"
            ]
        }), skyscraperConstruction);
    });

    it("使用して建設できないカードを建設しようとするとメッセージ", () => {
        asyncResolveFail(availableBed, skyscraperConstruction, {built: 3}, "そのカードは建設できません");
    });

    it("使用してコストが支払えないカードを建設しようとするとメッセージ", () => {
        asyncResolveFail(availableBed, skyscraperConstruction, {built: 1}, "建設に必要なコストを支払えません");1
    });

    it("使用して適切なカードを選択し、建設とコストとしての捨て札を行う", () => {
        assertAffectResolve(availableBed, skyscraperConstruction, {built: 0, discard: [0]}, [
            [
                "redが農村を建設しました",
                "redが手札から機械人形を捨てました"
            ],
            {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    trash: ["機械人形"],
                    players: [
                        {
                            ...TestPlayerRed,
                            hand: ["精錬所", "消費財"],
                            buildings: [{card: "農村", workers: []}]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ]);
    });

    it("使用して適切なカードを選択し、建設とコストとしての捨て札を行い、手札を使い切ればカードを2枚引く", () => {
        const bed: Game = {
            ...BlankBed,
            board: {
                ...BlankBed.board,
                deck: ["精錬所", "綿花農場"],
                players: [
                    {
                        ...TestPlayerRed,
                        hand: ["農村", "機械人形"]
                    },
                    TestPlayerBlue
                ]
            }
        };
        assertAffectResolve(bed, skyscraperConstruction, {built: 0, discard: [0]}, [
            [
                "redが農村を建設しました",
                "redが手札から機械人形を捨てました",
                "redがカードを2枚引きました"
            ],
            {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    trash: ["機械人形"],
                    players: [
                        {
                            ...TestPlayerRed,
                            hand: ["精錬所", "綿花農場"],
                            buildings: [{card: "農村", workers: []}]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ]);
    });
});