import "mocha";
import assert from "power-assert";
import { assertUnavailable, TestPlayerRed } from "test/interaction/bed";
import { cardEffect, AsyncCardEffect } from "model/interaction/game/card-effects";
import { BuildRequest } from "model/interaction/game/async-command";

describe("大聖堂", () => {
    it("職場としては使用できない", () => {
        assertUnavailable("大聖堂");
    });

    it("勝利点トークンを5枚以上所持していると建設コスト6、所有していないと建設コスト10", () => {
        const carpenter = cardEffect("大工") as AsyncCardEffect;
        const buildCommand = carpenter.command.name as BuildRequest;

        assert.equal(buildCommand.costCalclator("大聖堂", 
        {...TestPlayerRed, victoryToken: 4}), 10, "通常コストが異なる");
        assert.equal(buildCommand.costCalclator("大聖堂", 
        {...TestPlayerRed, victoryToken: 5}), 6, "軽減後コストが異なる");
    });
});