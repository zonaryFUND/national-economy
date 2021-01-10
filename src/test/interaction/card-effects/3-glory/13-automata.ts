import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { assertUnavailable, TestPlayerRed, assertAffectResolve, BlankBed, TestPlayerBlue, asyncResolveFail } from "test/interaction/bed";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("機械人形", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("機械人形");
    });
    
    it("労働者枠が埋まっている場合、建設できない", () => {
        const carpenter = cardEffect("大工");
        const player: Player = {
            ...TestPlayerRed,
            workers: [{type: "human", fetched: false}, {type: "human", fetched: false}, {type: "human", fetched: false}, {type: "human", fetched: false}, {type: "human", fetched: false}],
            hand: ["機械人形", "機関車工場", "浄火の神殿", "消費者組合", "消費財"]
        };
        asyncResolveFail(playerAffected(BlankBed, player), carpenter, {built: 0}, "そのカードは建設できません");
    });

    it("建設時に機械人形を1体得る", () => {
        const carpenter = cardEffect("大工");
        const player: Player = {
            ...TestPlayerRed,
            hand: ["機械人形", "機関車工場", "浄火の神殿", "消費者組合", "消費財"]
        };
        assertAffectResolve(
            playerAffected(BlankBed, player),
            carpenter,
            { built: 0, discard: [1, 2, 3, 4] },
            [
                [
                    "redが機械人形を建設しました",
                    "redの従業員に機械人形が1体追加されました",
                    "redが手札から機関車工場、浄火の神殿、消費者組合、消費財1枚を捨てました"
                ],
                {
                    ...BlankBed,
                    board: {
                        ...BlankBed.board,
                        trash: ["機関車工場", "浄火の神殿", "消費者組合"],
                        players: [
                            {
                                ...TestPlayerRed,
                                hand: [],
                                buildings: [{card: "機械人形", workers: []}],
                                workers: [
                                    {type: "human", fetched: false},
                                    {type: "human", fetched: false},
                                    {type: "automata", fetched: false}
                                ]
                            },
                            TestPlayerBlue
                        ]
                    }
                }
            ]
        )
    });
});