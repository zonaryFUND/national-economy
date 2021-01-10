import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { assertUnavailable, TestPlayerRed, BlankBed, TestPlayerBlue, assertAffectResolve } from "test/interaction/bed";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("遺物", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("遺物");
    });

    it("建設時に勝利点トークンを2枚得る", () => {
        const carpenter = cardEffect("大工");
        const player: Player = {
            ...TestPlayerRed,
            hand: ["遺物"]
        };
        assertAffectResolve(
            playerAffected(BlankBed, player),
            carpenter,
            { built: 0, discard: [] },
            [
                [
                    "redが遺物を建設しました",
                    "redが勝利点トークンを2つ獲得しました"
                ],
                {
                    ...BlankBed,
                    board: {
                        ...BlankBed.board,
                        players: [
                            {
                                ...TestPlayerRed,
                                hand: [],
                                buildings: [
                                    {card: "遺物", workers: []}
                                ],
                                victoryToken: 2
                            },
                            TestPlayerBlue
                        ]
                    }
                }
            ]
        );
    });
});