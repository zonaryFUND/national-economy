import "mocha";
import { cardEffect, AsyncCardEffect } from "model/interaction/game/card-effects";
import { BlankBed, TestPlayerRed, available, assertAffectResolve, unavailable, TestPlayerBlue } from "test/interaction/bed";
import { playerAffected } from "model/interaction/game/util";
import { Game, GameIO } from "model/protocol/game/game";
import { Player } from "model/protocol/game/player";
import { fetch, cancelFetching } from "model/interaction/game/fetching";
import { deepEqual } from "power-assert";

describe("転送装置", () => {
    const teleporter = cardEffect("転送装置");

    const bed: Game = {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            soldBuildings: [{card: "転送装置", workers: []}]
        }
    };

    const player: Player = {
        ...TestPlayerRed,
        hand: ["モダニズム建設"]
    };

    it("手札に建物カードがあり、使用可能労働者が2人以上いるとき使用可能", () => {
        available(playerAffected(bed, player), teleporter);
    });

    it("手札に建物カードがないとき使用不可能", () => {
        unavailable(bed, teleporter);
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
        unavailable(playerAffected(bed, oneWorker), teleporter);
    });

    const io: GameIO = {
        game: playerAffected(bed, player),
        shuffle: array => array
    };
    const fetching = fetch("sold", 0);
    const med = fetching.run(io);

    it("使用すると労働者を2人派遣して建物カードを選択し、建設する", () => {
        deepEqual(med[0], ["redが公共の転送装置に労働者を2人派遣しました"]);

        assertAffectResolve(med[1].game, teleporter, {targetIndex: 0}, [
            ["redがモダニズム建設を建設しました"],
            {
                board: {
                    ...bed.board,
                    soldBuildings: [{card: "転送装置", workers: [{type: "human", owner: "red"}, {type: "human", owner: "red"}]}],
                    players: [
                        {
                            ...TestPlayerRed,
                            buildings: [{card: "モダニズム建設", workers: []}],
                            workers: [{type: "human", fetched: true}, {type: "human", fetched: true}]
                        },
                        TestPlayerBlue
                    ]
                },
                state: med[1].game.state
            }
        ]);
    });

    it("キャンセルすると労働者が2人分戻ってくる", () => {
        const result = cancelFetching.run(med[1]);
        deepEqual(result[0], ["redが派遣を取り消しました"]);
        deepEqual(result[1].game, io.game);
    });
});