import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { playerAffected } from "model/interaction/game/util";
import { BlankBed, TestPlayerRed, available, unavailable, TestPlayerBlue } from "test/interaction/bed";
import { Player } from "model/protocol/game/player";
import { Game } from "model/protocol/game/game";
import { fetch } from "model/interaction/game/fetching";
import { deepEqual } from "power-assert";

describe("炭鉱", () => {
    const coalmine = cardEffect("炭鉱");

    const bed: Game = {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            deck: ["温室", "精錬所", "綿花農場", "蒸気工場", "転送装置"],
            soldBuildings: [{card: "炭鉱", workers: []}]
        }
    };
    
    it("使用可能労働者が2人以上いるとき使用可能", () => {
        available(bed, coalmine);
        
        const threeWorkers: Player = {
            ...TestPlayerRed,
            workers: [
                {type: "human", fetched: true}, 
                {type: "human", fetched: false}, 
                {type: "automata", fetched: false},
                {type: "automata", fetched: false},
                {type: "training-human", fetched: false}
            ]
        };
        available(playerAffected(bed, threeWorkers), coalmine);
    });

    it("使用可能労働者が1人のみのとき使用不可能", () => {
        const oneWorker: Player = {
            ...TestPlayerRed,
            workers: [
                {type: "human", fetched: true},
                {type: "human", fetched: true},
                {type: "automata", fetched: false},
                {type: "training-human", fetched: false}
            ]
        };
        unavailable(playerAffected(bed, oneWorker), coalmine);
    });

    it("使用すると労働者を2人派遣してカードを5枚引く", () => {
        const result = fetch("sold", 0).run({game: bed, shuffle: a => a});
        deepEqual(result[0], [
            "redが公共の炭鉱に労働者を2人派遣しました",
            "redがカードを5枚引きました"
        ], "ログが異なる");
        deepEqual(result[1].game, {
            ...bed,
            board: {
                ...bed.board,
                deck: [],
                soldBuildings: [{card: "炭鉱", workers: [{owner: "red", type: "human"}, {owner: "red", type: "human"}]}],
                players: [
                    {
                        ...TestPlayerRed,
                        hand: ["温室", "精錬所", "綿花農場", "蒸気工場", "転送装置"],
                        workers: [{type: "human", fetched: true}, {type: "human", fetched: true}]
                    },
                    TestPlayerBlue
                ]
            }
        }, "盤面変化が異なる");
    });
});