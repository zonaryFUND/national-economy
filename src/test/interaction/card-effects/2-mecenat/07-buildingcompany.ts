import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { available, BlankBed, TestPlayerRed, unavailable, asyncResolveFail, assertAffectResolve } from "test/interaction/bed";
import { playerAffected } from "model/interaction/game/util";
import { Player } from "model/protocol/game/player";
import { Game } from "model/protocol/game/game";

describe("建築会社", () => {
    const buildingCompany = cardEffect("建築会社");

    it("手札に売却不可能系建造物があり、かつコストが支払える場合使用可能", () => {
        available(playerAffected(BlankBed, {
            ...TestPlayerRed,
            hand: ["旧市街", "消費財", "石油コンビナート"]
        }), buildingCompany);
        available(playerAffected(BlankBed, {
            ...TestPlayerRed,
            victoryToken: 5,
            hand: ["大聖堂", "消費財", "消費財", "消費財", "消費財", "消費財", "消費財"]
        }), buildingCompany);
    });

    it("手札に売却不可能系建造物がない場合使用不可能", () => {
        unavailable(playerAffected(BlankBed, {
            ...TestPlayerRed,
            hand: ["石油コンビナート", "研究所", "芋畑", "観光牧場"]
        }), buildingCompany);
    });

    it("手札の売却不可能系建造物がすべて高コストすぎて建設コストを支払えない場合使用不可能", () => {
        unavailable(playerAffected(BlankBed, {
            ...TestPlayerRed,
            victoryToken: 4,
            hand: ["大聖堂", "消費財", "消費財", "消費財", "消費財", "消費財", "消費財"]
        }), buildingCompany);
        unavailable(playerAffected(BlankBed, {
            ...TestPlayerRed,
            victoryToken: 4,
            hand: ["大聖堂", "消費財", "輸出港", "投資銀行"]
        }), buildingCompany);
    });

    it("使用して売却不可能系建造物でないカードを建設しようとするとメッセージ", () => {
        const player: Player = {
            ...TestPlayerRed,
            hand: ["墓地", "輸出港", "食品工場", "消費財"]
        };
        asyncResolveFail(playerAffected(BlankBed, player), buildingCompany, {built: 2}, "そのカードは建設できません");
        asyncResolveFail(playerAffected(BlankBed, player), buildingCompany, {built: 3}, "そのカードは建設できません");
    });

    it("使用してコストを支払えないような売却不可能系建造物を建設しようとするとメッセージ", () => {
        const player: Player = {
            ...TestPlayerRed,
            hand: ["墓地", "輸出港", "食品工場", "消費財"]
        };
        asyncResolveFail(playerAffected(BlankBed, player), buildingCompany, {built: 1}, "建設に必要なコストを支払えません");
    });

    it("使用して適切なカードを選択し、建設とコストとしての捨て札を行う", () => {
        const bed: Game = {
            ...BlankBed,
            board: {
                ...BlankBed.board,
                deck: ["食品工場", "食堂"],
                players: {
                    0: {
                        ...TestPlayerRed,
                        victoryToken: 5,
                        hand: ["大聖堂", "消費財", "消費財", "消費財", "消費財", "消費財", "消費財"]
                    }
                }
            }
        };
        assertAffectResolve(
            bed, 
            buildingCompany,
            {built: 0, discard: [1, 2, 3, 4, 5, 6]},
            [
                [
                    "redが大聖堂を建設しました",
                    "redが手札から消費財6枚を捨てました",
                    "redがカードを2枚引きました"
                ],
                {
                    ...BlankBed,
                    board: {
                        ...BlankBed.board,
                        players: {
                            0: {
                                ...TestPlayerRed,
                                victoryToken: 5,
                                hand: ["食品工場", "食堂"],
                                buildings: [{card: "大聖堂", workersOwner: []}]
                            }
                        }
                    }
                }
            ]
        );
    });
});