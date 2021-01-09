import "mocha";
import assert from "power-assert";
import State from "monad/state/state";
import { Game } from "model/protocol/game/game";
import { EffectLog } from "model/interaction/game/sync-effect";
import { turnAround } from "model/interaction/game/turn";
import { BlankBed, TestPlayerRed, TestPlayerBlue } from "./bed";

describe("ターン終了", () => {
    const pseudoCleanup = new State<Game, EffectLog>(g => [["疑似クリーンナップ"], g]);

    it("未使用労働者がいる次のプレイヤーへターン移動", () => {
        const result = turnAround(pseudoCleanup).run(BlankBed);
        assert.deepEqual(result[0], [], "ログが異なる");
        assert.deepEqual(result[1], {
            ...BlankBed,
            state: {
                currentPlayer: "blue",
                phase: "dispatching"
            }
        }, "盤面変化が異なる");
    });

    it("ターン移動はループする", () => {
        const bed: Game = {
            ...BlankBed,
            state: {
                currentPlayer: "blue",
                phase: "dispatching"
            }
        };

        const result = turnAround(pseudoCleanup).run(bed);
        assert.deepEqual(result[0], [], "ログが異なる");
        assert.deepEqual(result[1], BlankBed, "盤面変化が異なる");
    });

    it("未使用労働者がいないプレイヤーはターンを飛ばす", () => {
        const bed: Game = {
            ...BlankBed,
            board: {
                ...BlankBed.board,
                players: [
                    TestPlayerRed,
                    {
                        ...TestPlayerBlue,
                        workers: [{type: "human", fetched: true}, {type: "human", fetched: true}]
                    },
                    {
                        ...TestPlayerRed,
                        id: "purple"
                    }
                ]
            }
        }

        const result = turnAround(pseudoCleanup).run(bed);
        assert.deepEqual(result[0], [], "ログが異なる");
        assert.deepEqual(result[1], {
            ...bed,
            state: {
                currentPlayer: "purple",
                phase: "dispatching"
            }
        }, "盤面変化が異なる");
    });

    it("全員が労働者を派遣し終わったらラウンドクリーンナップへ入る", () => {
        const bed: Game = {
            ...BlankBed,
            board: {
                ...BlankBed.board,
                players: [
                    {
                        ...TestPlayerRed,
                        workers: [{type: "human", fetched: true}, {type: "human", fetched: true}]
                    },
                    {
                        ...TestPlayerBlue,
                        workers: [{type: "human", fetched: true}, {type: "training-human", fetched: false}]
                    }
                ]
            }
        };

        const result = turnAround(pseudoCleanup).run(bed);
        assert.deepEqual(result[0], ["ラウンド1が終了しました", "疑似クリーンナップ"], "ログが異なる");
        assert.deepEqual(result[1], bed, "盤面変化が異なる");
    });
});