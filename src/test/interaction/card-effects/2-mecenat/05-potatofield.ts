import "mocha";
import { available, BlankBed, TestPlayerRed, assertAffect, unavailable } from "test/interaction/bed";
import { playerAffected } from "model/interaction/game/util";
import { cardEffect } from "model/interaction/game/card-effects";

describe("芋畑", () => {
    const potatofield = cardEffect("芋畑");

    it("手札が3枚未満のとき使用可能", () => {
        available(playerAffected(BlankBed, {...TestPlayerRed}), potatofield);
        available(playerAffected(BlankBed, {...TestPlayerRed, hand: ["菜園"]}), potatofield);
        available(playerAffected(BlankBed, {...TestPlayerRed, hand: ["菜園", "観光牧場"]}), potatofield);
    });

    it("手札が3枚以上のとき使用不可能", () => {
        unavailable(playerAffected(BlankBed, {...TestPlayerRed, hand: ["菜園", "観光牧場", "造船所"]}), potatofield);
    });

    it("使用して手札が3枚になるまで消費財を引く", () => {
        assertAffect(BlankBed, potatofield, [
            ["redが消費財を3枚引きました"],
            playerAffected(BlankBed, {...TestPlayerRed, hand: ["消費財", "消費財", "消費財"]})
        ]);
    });
});