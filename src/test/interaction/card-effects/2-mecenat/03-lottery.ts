import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { Game } from "model/protocol/game/game";
import { BlankBed, available, unavailable, assertAffect, TestPlayerBlue, TestPlayerRed } from "test/interaction/bed";

describe("宝くじ", () => {
    const lottery = cardEffect("宝くじ");

    const availableBed: Game = {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            houseHold: 20
        }
    };
    it("家計が$20以上あるとき使用可能", () => {
        available(availableBed, lottery);
    });

    it("家計が$20ないとき使用不可能", () => {
        unavailable({
            ...BlankBed,
            board: {
                ...BlankBed.board,
                houseHold: 19
            }
        }, lottery);
    });

    it("使用すると家計から$20得て$10返す", () => {
        assertAffect(availableBed, lottery, [
            [
                "redが家計から$20を獲得しました",
                "redが家計に$10を返しました"
            ],
            {
                ...availableBed,
                board: {
                    ...availableBed.board,
                    houseHold: 10,
                    players: {
                        0: {    
                            ...TestPlayerRed,
                            cash: 10
                        },
                        1: TestPlayerBlue
                    }
                }
            }
        ]);
    });
});