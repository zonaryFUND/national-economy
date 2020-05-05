import "mocha";
import { Game } from "model/protocol/game/game";
import { BlankBed, TestPlayerRed, TestPlayerBlue, available, unavailable, assertAffectResolve } from "../../bed";
import { cardEffect } from "model/interaction/game/card-effects";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("レストラン", () => {
    const restaurant = cardEffect("レストラン");
    const availableBed: Game =  {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            houseHold: 15,
            players: [
                {
                    ...TestPlayerRed,
                    hand: ["消費財", "農場", "鉄道"]
                },
                TestPlayerBlue
            ]
        }
    };

    it("手札が1枚以上、家計が$15以上あるとき使用可能", () => {
        available(availableBed, restaurant);
    });

    it("手札が足りないと使用不可能", () => {
        const player: Player = {
            ...TestPlayerRed,
            hand: []
        };
        
        unavailable(playerAffected(availableBed, player), restaurant);
    });

    it("家計が$15未満だと使用不可能", () => {
        const bed = {
            ...availableBed,
            board: {
                ...availableBed.board,
                houseHold: 10
            }
        };
        unavailable(bed, restaurant);
    });

    it("使用して捨て札を1枚選択し、家計から$15得る", () => {
        assertAffectResolve(
            availableBed, 
            restaurant,
            {
                targetHandIndices: [1]
            },
            [
                [
                    "redが手札から農場を捨てました",
                    "redが家計から$15を獲得しました"
                ],
                {
                    ...BlankBed,
                    board: {
                        ...BlankBed.board,
                        houseHold: 0,
                        trash: ["農場"],
                        players: [
                            {
                                ...TestPlayerRed,
                                hand: ["消費財", "鉄道"],
                                cash: 15
                            },
                            TestPlayerBlue
                        ]
                    }
                }
            ]
        );
    });

});