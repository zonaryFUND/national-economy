import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { available, BlankBed, assertAffect, TestPlayerRed } from "test/interaction/bed";
import { Game } from "model/protocol/game/game";

describe("石油コンビナート", () => {
    const petroleumComplex = cardEffect("石油コンビナート");

    it("任意の状態で使用可能", () => {
        available(BlankBed, petroleumComplex);
    });

    it("使用するとカードを3枚引く", () => {
        const bed: Game = {
            ...BlankBed,
            board: {
                ...BlankBed.board,
                deck: ["研究所", "芋畑", "観光牧場", "造船所"]
            }
        };

        assertAffect(bed, petroleumComplex, [
            ["redがカードを4枚引きました"],
            {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    players: {
                        ...BlankBed.board.players,
                        0: {
                            ...TestPlayerRed,
                            hand: ["研究所", "芋畑", "観光牧場", "造船所"]
                        }
                    }
                }
            }
        ]);
    });
});