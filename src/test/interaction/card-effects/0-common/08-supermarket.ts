import "mocha";
import { Game } from "model/protocol/game/game";
import { BlankBed, TestPlayerRed, TestPlayerBlue, available, unavailable, assertAffectResolve } from "../../bed";
import { cardEffect } from "model/interaction/game/card-effects";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("スーパーマーケット", () => {
    const supermarket = cardEffect("スーパーマーケット");
    const availableBed: Game =  {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            houseHold: 20,
            players: [
                {
                    ...TestPlayerRed,
                    hand: ["消費財", "農場", "鉄道", "邸宅"]
                },
                TestPlayerBlue
            ]
        }
    };

    it("手札が3枚以上、家計が$18以上あるとき使用可能", () => {
        available(availableBed, supermarket);
    });

    it("手札が足りないと使用不可能", () => {
        const player: Player = {
            ...TestPlayerRed,
            hand: ["消費財", "消費財"]
        };
        
        unavailable(playerAffected(availableBed, player), supermarket);
    });

    it("家計が$18未満だと使用不可能", () => {
        const bed = {
            ...availableBed,
            board: {
                ...availableBed.board,
                houseHold: 17
            }
        };
        unavailable(bed, supermarket);
    });

    it("使用して捨て札を3枚選択し、家計から$18得る", () => {
        assertAffectResolve(
            availableBed, 
            supermarket,
            {
                targetHandIndices: [0, 2, 3]
            },
            [
                [
                    "redが手札から鉄道、邸宅、消費財1枚を捨てました",
                    "redが家計から$18を獲得しました"
                ],
                {
                    ...BlankBed,
                    board: {
                        ...BlankBed.board,
                        houseHold: 2,
                        trash: ["鉄道", "邸宅"],
                        players: [
                            {
                                ...TestPlayerRed,
                                hand: ["農場"],
                                cash: 18
                            },
                            TestPlayerBlue
                        ]
                    }
                }
            ]
        );
    });

});