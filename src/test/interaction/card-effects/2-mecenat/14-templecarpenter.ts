import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { Game } from "model/protocol/game/game";
import { BlankBed, TestPlayerRed, available, unavailable, asyncResolveFail, assertAffectResolve, TestPlayerBlue } from "test/interaction/bed";
import { playerAffected } from "model/interaction/game/util";

describe("宮大工", () => {
    const templecarpenter = cardEffect("宮大工");
    
    const availableBed: Game = playerAffected(BlankBed, {
        ...TestPlayerRed,
        hand: ["墓地", "大聖堂", "石油コンビナート", "消費財"]
    });
    it("建設できる建物があるとき使用可能", () => {
        available(availableBed, templecarpenter);
    });

    it("手札が空のとき使用不可能", () => {
        unavailable(BlankBed, templecarpenter); 
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
        }), templecarpenter);
    });

    it("コストを支払える手札がないとき使用不可能", () => {
        unavailable(playerAffected(BlankBed, {
            ...TestPlayerRed,
            hand: [
                "大聖堂",
                "石油コンビナート",
                "研究所"
            ]
        }), templecarpenter);
    });

    it("使用して建設できないカードを建設しようとするとメッセージ", () => {
        asyncResolveFail(availableBed, templecarpenter, {built: 3}, "そのカードは建設できません");
    });

    it("使用してコストが支払えないカードを建設しようとするとメッセージ", () => {
        asyncResolveFail(availableBed, templecarpenter, {built: 1}, "建設に必要なコストを支払えません");1
    });

    it("使用して適切なカードを選択し、建設とコストとしての捨て札を行った後、勝利点トークンを1枚得る", () => {
        assertAffectResolve(availableBed, templecarpenter, {built: 0, discard: [0]}, [
            [
                "redが墓地を建設しました",
                "redが手札から大聖堂を捨てました",
                "redが勝利点トークンを1つ獲得しました"
            ],
            {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    trash: ["大聖堂"],
                    players: {
                        0: {
                            ...TestPlayerRed,
                            hand: ["石油コンビナート", "消費財"],
                            buildings: [{card: "墓地", workers: []}],
                            victoryToken: 1
                        },
                        1: TestPlayerBlue
                    }
                }
            }
        ]);
    });
});