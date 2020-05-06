import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { available, BlankBed, assertAffect, TestPlayerRed } from "test/interaction/bed";
import { playerAffected } from "model/interaction/game/util";

describe("醸造所", () => {
    const brewery = cardEffect("醸造所");

    it("任意の状態で使用可能", () => {
        available(BlankBed, brewery);
    });

    it("使用すると消費財4枚を取り置きフィールドに追加", () => {
        assertAffect(BlankBed, brewery, [
            ["redが消費財4枚を取り置きました"],
            playerAffected(BlankBed, {
                ...TestPlayerRed,
                reservedCards: ["消費財", "消費財", "消費財", "消費財"]
            })
        ]);
    });
});;