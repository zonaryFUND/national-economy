import "mocha";
import { Game } from "model/protocol/game/game";
import { BlankBed, TestPlayerRed, TestPlayerBlue, available, unavailable, assertAffectResolve } from "../../bed";
import { cardEffect } from "model/interaction/game/card-effects";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("万博", () => {
    const internationalexposition = cardEffect("万博");
    const availableBed: Game =  {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            houseHold: 30,
            players: [
                {
                    ...TestPlayerRed,
                    hand: ["消費財", "農場", "鉄道", "邸宅", "レストラン"]
                },
                TestPlayerBlue
            ]
        }
    };

    it("手札が5枚以上、家計が$30以上あるとき使用可能", () => {
        available(availableBed, internationalexposition);
    });

    it("手札が足りないと使用不可能", () => {
        const player: Player = {
            ...TestPlayerRed,
            hand: ["消費財", "消費財", "消費財", "消費財"]
        };
        
        unavailable(playerAffected(availableBed, player), internationalexposition);
    });

    it("家計が$30未満だと使用不可能", () => {
        const bed = {
            ...availableBed,
            board: {
                ...availableBed.board,
                houseHold: 29
            }
        };
        unavailable(bed, internationalexposition);
    });

    it("使用して捨て札を5枚選択し、家計から$30得る", () => {
        assertAffectResolve(
            availableBed, 
            internationalexposition,
            {
                targetHandIndices: [0, 1, 2, 3, 4]
            },
            [
                [
                    "redが手札から農場、鉄道、邸宅、レストラン、消費財1枚を捨てました",
                    "redが家計から$30を獲得しました"
                ],
                {
                    ...BlankBed,
                    board: {
                        ...BlankBed.board,
                        houseHold: 0,
                        trash: ["農場", "鉄道", "邸宅", "レストラン"],
                        players: [
                            {
                                ...TestPlayerRed,
                                hand: [],
                                cash: 30
                            },
                            TestPlayerBlue
                        ]
                    }
                }
            ]
        );
    });

});