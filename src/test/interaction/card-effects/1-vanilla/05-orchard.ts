import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { TestPlayerRed, available, BlankBed, TestPlayerBlue, unavailable, assertAffect } from "../../bed";
import { Player } from "model/protocol/game/player";
import { Game } from "model/protocol/game/game";
import { playerAffected } from "model/interaction/game/util";

describe("果樹園", () => {
    const orchard = cardEffect("果樹園");
    
    const oneHandRedPlayer: Player = {...TestPlayerRed, hand: ["ゼネコン"]};
    const twoHandRedPlayer: Player = {...TestPlayerRed, hand: ["ゼネコン", "レストラン"]};
    const threeHandRedPlayer: Player = {...TestPlayerRed, hand: ["ゼネコン", "レストラン", "不動産屋"]};
    const fourHandRedPlayer: Player = {...TestPlayerRed, hand: ["ゼネコン", "レストラン", "不動産屋", "化学工場"]};

    it("手札が3枚以下のとき使用可能", () => {
        available(BlankBed, orchard);
        available(playerAffected(BlankBed, oneHandRedPlayer), orchard);
        available(playerAffected(BlankBed, twoHandRedPlayer), orchard);
        available(playerAffected(BlankBed, threeHandRedPlayer), orchard);
    });

    it("手札が4枚以上あるとき使用不可能", () => {
        unavailable(playerAffected(BlankBed, fourHandRedPlayer), orchard);
    });

    it("手札が2枚のとき消費財を2枚得る", () => {
        assertAffect(playerAffected(BlankBed, twoHandRedPlayer), orchard, [
            ["redが消費財を2枚引きました"],
            {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    players: [
                        {
                            ...twoHandRedPlayer,
                            hand: ["ゼネコン", "レストラン", "消費財", "消費財"]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ])
    });
});