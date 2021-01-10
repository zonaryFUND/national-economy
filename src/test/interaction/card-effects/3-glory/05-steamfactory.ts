import "mocha";
import assert from "power-assert";
import { cardEffect, AsyncCardEffect } from "model/interaction/game/card-effects";
import { TestPlayerRed, BlankBed, TestPlayerBlue, available, unavailable, assertAffectIOResolve } from "test/interaction/bed";
import { Player } from "model/protocol/game/player";
import { Game, GameIO } from "model/protocol/game/game";
import { playerAffected } from "model/interaction/game/util";
import { BuildRequest } from "model/interaction/game/async-command";

describe("蒸気工場", () => {
    const steamfactory = cardEffect("蒸気工場");
    const threeHandPlayer: Player = {...TestPlayerRed, hand: ["精錬所", "美術館", "記念碑"]};
    const availableBed: Game = {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            deck: ["炭鉱", "温室"],
            players: {
                0: threeHandPlayer,
                1: TestPlayerBlue
            }
        }
    };

    it("手札2枚以上で使用可能", () => {
        available(availableBed, steamfactory);
    });

    it("手札2枚未満で使用不可能", () => {
        unavailable(playerAffected(availableBed, TestPlayerRed), steamfactory);
    });

    it("使用して捨て札を2枚選択し、カードを4枚引く", () => {
        const io: GameIO = {
            game: availableBed,
            shuffle: array => array.reverse()
        };

        assertAffectIOResolve(io, steamfactory, {targetHandIndices: [0, 1]}, [
            [
                "redが手札から精錬所、美術館を捨てました",
                "捨て札がシャッフルされ山札の下に補充されました",
                "redがカードを4枚引きました"
            ],
            {
                ...availableBed,
                board: {
                    ...availableBed.board,
                    deck: [],
                    trash: [],
                    players: [
                        {
                            ...threeHandPlayer,
                            hand: ["記念碑", "炭鉱", "温室", "美術館", "精錬所"]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ]);
    });

    it("2枚以上の勝利点トークンを所有していると建設コスト1、所有していないと建設コスト2", () => {
        const carpenter = cardEffect("大工") as AsyncCardEffect;
        const buildCommand = carpenter.command.name as BuildRequest;

        assert.equal(buildCommand.costCalclator("蒸気工場", 
        {...TestPlayerRed, victoryToken: 1}), 2, "通常コストが異なる");
        assert.equal(buildCommand.costCalclator("蒸気工場", 
        {...TestPlayerRed, victoryToken: 2}), 1, "軽減後コストが異なる");
    });
});