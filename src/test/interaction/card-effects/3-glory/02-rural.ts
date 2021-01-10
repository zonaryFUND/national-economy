import "mocha";
import { cardEffect, AsyncCardEffect } from "model/interaction/game/card-effects";
import { available, BlankBed, TestPlayerRed, assertAffectResolve, TestPlayerBlue } from "test/interaction/bed";
import { OptionsRequest } from "model/interaction/game/async-command";
import { fail, deepEqual } from "power-assert";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";
import { Game } from "model/protocol/game/game";

describe("農村", () => {
    const rural = cardEffect("農村");

    it("任意の状況で使用可能", () => {
        available(BlankBed, rural);
    });

    it("「消費財を2枚捨ててカードを3枚引く」オプションは消費財が2枚以上のときのみ利用可能", () => {
        const command = (rural as AsyncCardEffect).command.name as OptionsRequest;
        if (command == null) fail();

        deepEqual(command.options(TestPlayerRed), [{text: "消費財を2枚引く", available: true}, {text: "消費財を2枚捨ててカードを3枚引く", available: false}], "空の手札に対する有効な選択肢が異なる");

        const oneConsumable: Player = {
            ...TestPlayerRed,
            hand: ["消費財", "機関車工場"]
        };
        deepEqual(command.options(oneConsumable), [{text: "消費財を2枚引く", available: true}, {text: "消費財を2枚捨ててカードを3枚引く", available: false}], "手札の消費財が1枚のときの有効な選択肢が異なる");

        const twoConsumable: Player = {
            ...TestPlayerRed,
            hand: ["消費財", "消費財", "浄火の神殿"]
        }
        deepEqual(command.options(twoConsumable), [{text: "消費財を2枚引く", available: true}, {text: "消費財を2枚捨ててカードを3枚引く", available: true}], "手札の消費財が2枚以上のときの有効な選択肢が異なる");
    });

    it("使用して「消費財を2枚引く」オプションを選択する", () => {
        assertAffectResolve(
            BlankBed,
            rural,
            {index: 0},
            [
                ["redが消費財を2枚引きました"],
                {
                    ...BlankBed,
                    board: {
                        ...BlankBed.board,
                        players: [
                            {
                                ...TestPlayerRed,
                                hand: ["消費財", "消費財"]
                            },
                            TestPlayerBlue
                        ]
                    }
                }
            ]
        );
    });

    it("使用して「消費財を2枚捨て、カードを3枚引く」オプションを選択する", () => {
        const bed: Game = {
            ...BlankBed,
            board: {
                ...BlankBed.board,
                deck: ["綿花農場", "象牙の塔", "養鶏場", "農村"],
                players: [
                    {...TestPlayerRed, hand: ["消費財", "消費者組合", "消費財", "消費財", "精錬所"]},
                    TestPlayerBlue
                ]
            }
        }
        assertAffectResolve(
            bed,
            rural,
            {index: 1},
            [
                [
                    "redが手札から消費財2枚を捨てました",
                    "redがカードを3枚引きました"
                ],
                {
                    ...BlankBed,
                    board: {
                        ...BlankBed.board,
                        deck: ["農村"],
                        players: [
                            {...TestPlayerRed, hand: ["消費者組合", "消費財", "精錬所", "綿花農場", "象牙の塔", "養鶏場"]},
                            TestPlayerBlue
                        ]
                    }
                }
            ]
        );
    });
});