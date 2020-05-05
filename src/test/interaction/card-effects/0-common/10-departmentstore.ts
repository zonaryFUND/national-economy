import "mocha";
import { Game } from "model/protocol/game/game";
import { BlankBed, TestPlayerRed, TestPlayerBlue, available, unavailable, assertAffectResolve } from "../../bed";
import { cardEffect } from "model/interaction/game/card-effects";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("百貨店", () => {
    const departmentstore = cardEffect("百貨店");
    const availableBed: Game =  {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            houseHold: 30,
            players: [
                {
                    ...TestPlayerRed,
                    hand: ["消費財", "消費財", "鉄道", "邸宅", "レストラン"]
                },
                TestPlayerBlue
            ]
        }
    };

    it("手札が4枚以上、家計が$24以上あるとき使用可能", () => {
        available(availableBed, departmentstore);
    });

    it("手札が足りないと使用不可能", () => {
        const player: Player = {
            ...TestPlayerRed,
            hand: ["消費財", "消費財", "消費財"]
        };
        
        unavailable(playerAffected(availableBed, player), departmentstore);
    });

    it("家計が$24未満だと使用不可能", () => {
        const bed = {
            ...availableBed,
            board: {
                ...availableBed.board,
                houseHold: 23
            }
        };
        unavailable(bed, departmentstore);
    });

    it("使用して捨て札を4枚選択し、家計から$24得る", () => {
        assertAffectResolve(
            availableBed, 
            departmentstore,
            {
                targetHandIndices: [0, 1, 2, 3]
            },
            [
                [
                    "redが手札から鉄道、邸宅、消費財2枚を捨てました",
                    "redが家計から$24を獲得しました"
                ],
                {
                    ...BlankBed,
                    board: {
                        ...BlankBed.board,
                        houseHold: 6,
                        trash: ["鉄道", "邸宅"],
                        players: [
                            {
                                ...TestPlayerRed,
                                hand: ["レストラン"],
                                cash: 24
                            },
                            TestPlayerBlue
                        ]
                    }
                }
            ]
        );
    });

});