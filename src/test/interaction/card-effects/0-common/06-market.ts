import "mocha";
import { Game } from "model/protocol/game/game";
import { BlankBed, TestPlayerRed, TestPlayerBlue, available, playerAffected, unavailable, assertAffectResolve } from "../../bed";
import { cardEffect } from "model/interaction/game/card-effects";
import { Player } from "model/protocol/game/player";

describe("市場", () => {
    const market = cardEffect("市場");
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

    it("手札が2枚以上、家計が$12以上あるとき使用可能", () => {
        available(availableBed, market);
    });

    it("手札が足りないと使用不可能", () => {
        const player: Player = {
            ...TestPlayerRed,
            hand: ["消費財"]
        };
        
        unavailable(playerAffected(availableBed, player), market);
    });

    it("家計が$12未満だと使用不可能", () => {
        const bed = {
            ...availableBed,
            board: {
                ...availableBed.board,
                houseHold: 10
            }
        };
        unavailable(bed, market);
    });

    it("使用して捨て札を2枚選択し、家計から$12得る", () => {
        assertAffectResolve(
            availableBed, 
            market,
            {
                targetHandIndices: [0, 2]
            },
            [
                [
                    "redが手札から鉄道、消費財1枚を捨てました",
                    "redが家計から$12を獲得しました"
                ],
                {
                    ...BlankBed,
                    board: {
                        ...BlankBed.board,
                        houseHold: 3,
                        trash: ["鉄道"],
                        players: [
                            {
                                ...TestPlayerRed,
                                hand: ["農場"],
                                cash: 12
                            },
                            TestPlayerBlue
                        ]
                    }
                }
            ]
        );
    });

});