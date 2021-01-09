import "mocha";
import { available, BlankBed, TestPlayerRed, unavailable, assertAffect } from "../../bed";
import { cardEffect } from "model/interaction/game/card-effects";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("大学", () => {
    const university = cardEffect("大学");

    it("労働者4人以下で使用可能", () => {
        available(BlankBed, university);
    });

    const fiveWorkersPlayer: Player = {
        ...TestPlayerRed,
        workers: [{type: "human", fetched: false}, {type: "human", fetched: false}, {type: "human", fetched: false}, {type: "human", fetched: false}, {type: "human", fetched: false}]
    };

    it("労働者5人いると使用不可能", () => {
        const bed = playerAffected(BlankBed, fiveWorkersPlayer);
        unavailable(bed, university);
    });

    it("労働者5人いると社宅があっても使用不可能", () => {
        const fiveWorkersAndHousingPlayer: Player = {
            ...fiveWorkersPlayer,
            buildings: [{card: "社宅", workers: []}],
        };
        const bed = playerAffected(BlankBed, fiveWorkersAndHousingPlayer);
        unavailable(bed, university);
    });

    it("使用すると研修中労働者を労働者総数が5人になるまで追加", () => {
        assertAffect(BlankBed, university, [
            [
                "redが労働者3人を研修中として雇用しました"
            ],
            playerAffected(BlankBed, {
                ...TestPlayerRed,
                workers: TestPlayerRed.workers.concat({type: "training-human", fetched: false}, {type: "training-human", fetched: false}, {type: "training-human", fetched: false})
            })
        ]);
    });
});