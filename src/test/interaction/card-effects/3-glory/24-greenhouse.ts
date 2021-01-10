import "mocha";
import assert from "power-assert";
import { cardEffect, AsyncCardEffect } from "model/interaction/game/card-effects";
import { BlankBed, available, unavailable, assertAffect, TestPlayerRed, TestPlayerBlue } from "../../bed";
import { BuildRequest } from "model/interaction/game/async-command";

describe("温室", () => {
    const greenhouse = cardEffect("温室");

    it("任意の状態で使用可能", () => {
        available(BlankBed, greenhouse);
    });

    it("使用すると消費財を4枚引く", () => {
        assertAffect(BlankBed, greenhouse, [
            [
                "redが消費財を4枚引きました"
            ],
            {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    players: [
                        {
                            ...TestPlayerRed,
                            hand: ["消費財", "消費財", "消費財", "消費財"]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ])
    });

    it("4枚以上の勝利点トークンを所有していると建設コスト4、所有していないと建設コスト6", () => {
        const carpenter = cardEffect("大工") as AsyncCardEffect;
        const buildCommand = carpenter.command.name as BuildRequest;

        assert.equal(buildCommand.costCalclator("温室", 
        {...TestPlayerRed, victoryToken: 3}), 6, "通常コストが異なる");
        assert.equal(buildCommand.costCalclator("温室", 
        {...TestPlayerRed, victoryToken: 4}), 4, "軽減後コストが異なる");
    });
});