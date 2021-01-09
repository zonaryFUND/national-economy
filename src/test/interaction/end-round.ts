import "mocha";
import assert from "power-assert";
import { Game } from "model/protocol/game/game";
import { BlankBed, TestPlayerRed, TestPlayerBlue } from "./bed";
import State from "monad/state/state";
import { EffectLog } from "model/interaction/game/sync-effect";
import { endRound } from "model/interaction/game/end-round";

describe("ラウンド終了処理", () => {
    const pseudoFinish = new State<Game, EffectLog>(g => [["疑似ゲーム終了"], g]);

    it("ラウンド終了のクリーンナップ後、ラウンド数の増加・労働者のリセット・研修の終了、取り置きカードの入手を行い、スタートプレイヤーの派遣待ち状態にする", () => {
        const bed: Game = {
            board: {
                ...BlankBed.board,
                currentRound: 1,
                startPlayer: "blue",
                publicBuildings: [{card: "採石場", workers: [{owner: "red", type: "human"}]}],
                soldBuildings: [{card: "果樹園", workers: [{owner: "red", type: "human"}]}],
                players: [
                    {
                        ...TestPlayerRed,
                        workers: [{type: "human", fetched: true}, {type: "human", fetched: true}, {type: "training-human", fetched: true}],
                        hand: ["食品工場"],
                        reservedCards: ["消費財", "消費財", "消費財", "消費財"],
                        buildings: [{card: "ゼネコン", workers: [{owner: "red", type: "human"}]}]
                    },
                    TestPlayerBlue
                ]
            },
            state: {
                red: "finish",
                blue: "finish"
            }
        };

        const result = endRound(pseudoFinish).run(bed);
        assert.deepEqual(result[0], [
            "redが取り置いていた消費財4枚を手札に加えました",
            "redの新入社員1人が研修を終えました",
            "ラウンド2をスタートプレイヤーblueから開始します"
        ], "ログが異なる");
        assert.deepEqual(result[1], {
            ...BlankBed,
            board: {
                ...BlankBed.board,
                currentRound: 2,
                startPlayer: "blue",
                publicBuildings: [{card: "採石場", workers: []}],
                soldBuildings: [{card: "果樹園", workers: []}],
                players: [
                    {
                        ...TestPlayerRed,
                        workers: [{type: "human", fetched: false}, {type: "human", fetched: false}, {type: "human", fetched: false}],
                        hand: ["食品工場", "消費財", "消費財", "消費財", "消費財"],
                        buildings: [{card: "ゼネコン", workers: []}]
                    },
                    TestPlayerBlue
                ]
            },
            state: {
                currentPlayer: "blue",
                phase: "dispatching"
            }
        }, "盤面変化が異なる");
    });

    it("ラウンド9が終了したらゲームを終了する", () => {
        const bed: Game = {
            ...BlankBed,
            board: {
                ...BlankBed.board,
                currentRound: 9
            }
        };

        const result = endRound(pseudoFinish).run(bed);
        assert.deepEqual(result[0], ["疑似ゲーム終了"], "ログが異なる");
        assert.deepEqual(result[1], bed, "盤面変化が異なる");
    });
});