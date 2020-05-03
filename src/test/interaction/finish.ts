import "mocha";
import assert from "assert";
import { Game } from "model/protocol/game/game";
import { BlankBed, TestPlayerRed, TestPlayerBlue } from "./bed";
import { finish } from "model/interaction/game/finish";

describe("ゲーム終了", () => {
    it("ゲーム終了で最高スコアのプレイヤーを勝者として決定する", () => {
        const bed: Game = {
            ...BlankBed,
            board: {
                ...BlankBed.board,
                players: [
                    {
                        ...TestPlayerRed,
                        cash: 10
                    },
                    {
                        ...TestPlayerBlue,
                        cash: 20
                    },
                    {
                        ...TestPlayerRed,
                        id: "orange",
                        cash: 30
                    },
                    {
                        ...TestPlayerRed,
                        id: "purple",
                        cash: 40
                    },
                ]
            }
        }

        const result = finish.run(bed);
        assert.deepEqual(result[0], [
            "redは10点を獲得しました",
            "blueは20点を獲得しました",
            "orangeは30点を獲得しました",
            "purpleは40点を獲得しました",
            "purpleが40点で勝利！"
        ], "終了時メッセージが異なる");
        assert.deepEqual(result[1], {
            ...bed,
            state: {
                winner: "purple"
            }
        }, "結果への状態遷移が異なる");
    });

    it("ゲーム終了で最高スコアのプレイヤーを勝者として決定する(タイブレークあり)", () => {
        const bed: Game = {
            ...BlankBed,
            board: {
                ...BlankBed.board,
                startPlayer: "purple",
                players: [
                    {
                        ...TestPlayerRed,
                        cash: 30
                    },
                    {
                        ...TestPlayerBlue,
                        cash: 30
                    },
                    {
                        ...TestPlayerRed,
                        id: "orange",
                        cash: 30
                    },
                    {
                        ...TestPlayerRed,
                        id: "purple",
                        cash: 10
                    },
                ]
            }
        }

        const result = finish.run(bed);
        assert.deepEqual(result[0], [
            "redは30点を獲得しました",
            "blueは30点を獲得しました",
            "orangeは30点を獲得しました",
            "purpleは10点を獲得しました",
            "redが30点で勝利！(タイブレーク)"
        ], "終了時メッセージが異なる");
        assert.deepEqual(result[1], {
            ...bed,
            state: {
                winner: "red"
            }
        }, "結果への状態遷移が異なる");
    });
});