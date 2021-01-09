import "mocha";
import assert from "power-assert";
import { cardEffect, AsyncCardEffect } from "model/interaction/game/card-effects";
import { TestPlayerRed, BlankBed, TestPlayerBlue, available, unavailable, assertAffectIOResolve } from "test/interaction/bed";
import { Player } from "model/protocol/game/player";
import { Game, GameIO } from "model/protocol/game/game";
import { playerAffected } from "model/interaction/game/util";
import { BuildRequest } from "model/interaction/game/async-command";

describe("食品工場", () => {
    const foodfactory = cardEffect("食品工場");
    const threeHandPlayer: Player = {...TestPlayerRed, hand: ["会計事務所", "博物館", "大聖堂"]};
    const availableBed: Game = {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            deck: ["宮大工", "工業団地"],
            players: {
                0: threeHandPlayer,
                1: TestPlayerBlue
            }
        }
    };

    it("手札2枚以上で使用可能", () => {
        available(availableBed, foodfactory);
    });

    it("手札2枚未満で使用不可能", () => {
        unavailable(playerAffected(availableBed, TestPlayerRed), foodfactory);
    });

    it("使用して捨て札を2枚選択し、カードを4枚引く", () => {
        const io: GameIO = {
            game: availableBed,
            shuffle: array => array.reverse()
        };

        assertAffectIOResolve(io, foodfactory, {targetHandIndices: [0, 1]}, [
            [
                "redが手札から会計事務所、博物館を捨てました",
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
                            hand: ["大聖堂", "宮大工", "工業団地", "博物館", "会計事務所"]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ]);
    });

    it("農業系建物を所有していると建設コスト1、所有していないと建設コスト2", () => {
        const carpenter = cardEffect("大工") as AsyncCardEffect;
        const buildCommand = carpenter.command.name as BuildRequest;

        assert.equal(buildCommand.costCalclator("食品工場", 
        {...TestPlayerRed, buildings: [{card: "造船所", workers: []}]}), 2, "通常コストが異なる");
        assert.equal(buildCommand.costCalclator("食品工場", 
        {...TestPlayerRed, buildings: [{card: "芋畑", workers: []}]}), 1, "軽減後コストが異なる");
    });
});