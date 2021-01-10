import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { playerAffected } from "model/interaction/game/util";
import { BlankBed, TestPlayerRed, available, unavailable, TestPlayerBlue } from "test/interaction/bed";
import { Player } from "model/protocol/game/player";
import { Game } from "model/protocol/game/game";
import { fetch } from "model/interaction/game/fetching";
import { deepEqual } from "power-assert";

describe("綿花農場", () => {
    const cottonFarm = cardEffect("綿花農場");

    const bed: Game = {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            soldBuildings: [{card: "綿花農場", workers: []}]
        }
    };
    
    it("使用可能労働者が2人以上いるとき使用可能", () => {
        available(bed, cottonFarm);
        
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
        available(playerAffected(bed, threeWorkers), cottonFarm);
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
        unavailable(playerAffected(bed, oneWorker), cottonFarm);
    });

    it("使用すると労働者を2人派遣して消費財を5枚引く", () => {
        const result = fetch("sold", 0).run({game: bed, shuffle: a => a});
        deepEqual(result[0], [
            "redが公共の綿花農場に労働者を2人派遣しました",
            "redが消費財を5枚引きました"
        ], "ログが異なる");
        deepEqual(result[1].game, {
            ...bed,
            board: {
                ...bed.board,
                soldBuildings: [{card: "綿花農場", workers: [{owner: "red", type: "human"}, {owner: "red", type: "human"}]}],
                players: [
                    {
                        ...TestPlayerRed,
                        hand: ["消費財", "消費財", "消費財", "消費財", "消費財"],
                        workers: [{type: "human", fetched: true}, {type: "human", fetched: true}]
                    },
                    TestPlayerBlue
                ]
            }
        }, "盤面変化が異なる");
    });
});