import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { Game } from "model/protocol/game/game";
import { BlankBed, available, unavailable, assertAffect, TestPlayerBlue, TestPlayerRed } from "test/interaction/bed";

describe("鉄工所", () => {
    const ironworks = cardEffect("鉄工所");

    const availableBed: Game = {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            deck: ["食堂", "養殖場"],
            publicBuildings: [{card: "鉱山", workersOwner: ["red"]}]
        }
    };
    it("鉱山に自分の労働者がいれば使用可能", () => {
        available(availableBed, ironworks);  
    });

    it("鉱山に自分の労働者がいないと使用不可能", () => {
        unavailable(BlankBed, ironworks);
        unavailable({
            ...BlankBed,
            board: {
                ...BlankBed.board,
                publicBuildings: [{card: "鉱山", workersOwner: ["blue"]}]
            }
        }, ironworks);
    });

    it("使用するとカードを2枚引く", () => {
        assertAffect(availableBed, ironworks, [
            ["redがカードを2枚引きました"],
            {
                ...availableBed,
                board: {
                    ...availableBed.board,
                    deck: [],
                    players: {
                        0: {
                            ...TestPlayerRed,
                            hand: ["食堂", "養殖場"]
                        },
                        1: TestPlayerBlue
                    }
                }
            }
        ]);
    });
});