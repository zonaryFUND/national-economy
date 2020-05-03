import "mocha";
import { Game } from "model/protocol/game/game";
import { BlankBed, available, unavailable, assertAffect, TestPlayerRed, TestPlayerBlue } from "../../bed";
import { cardEffect } from "model/interaction/game/card-effects";

describe("珈琲店", () => {
    const cafe = cardEffect("珈琲店");
    const availableBed: Game =  {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            houseHold: 10,
        }
    };

    it("家計が$5以上あるとき使用可能", () => {
        available(availableBed, cafe);
    });

    it("家計が$5未満だと使用不可能", () => {
        const bed = {
            ...availableBed,
            board: {
                ...availableBed.board,
                houseHold: 4
            }
        };
        unavailable(bed, cafe);
    });

    it("家計から$5得る", () => {
        assertAffect(availableBed, cafe, [
            ["redが家計から$5を獲得しました"],
            {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    houseHold: 5,
                    players: [
                        {
                            ...TestPlayerRed,
                            cash: 5
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ]);
    });

});