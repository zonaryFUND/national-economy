import "mocha";
import { available, BlankBed, TestPlayerRed, unavailable, assertAffect } from "../../bed";
import { cardEffect } from "model/interaction/game/card-effects";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("高等学校", () => {
    const highschool = cardEffect("高等学校");

    it("労働者3人以下で使用可能", () => {
        available(BlankBed, highschool);
    });

    const fourWorkersPlayer: Player = {
        ...TestPlayerRed,
        workers: [{type: "human", fetched: false}, {type: "human", fetched: false}, {type: "human", fetched: false}, {type: "human", fetched: false}]
    };

    it("労働者4人いると使用不可能", () => {
        const bed = playerAffected(BlankBed, fourWorkersPlayer);
        unavailable(bed, highschool);
    });

    it("労働者4人いると社宅があっても使用不可能", () => {
        const fourWorkersAndHousingPlayer: Player = {
            ...fourWorkersPlayer,
            buildings: [{card: "社宅", workers: []}],
        };
        const bed = playerAffected(BlankBed, fourWorkersAndHousingPlayer);
        unavailable(bed, highschool);
    });

    it("使用すると研修中労働者を労働者総数が4人になるまで追加", () => {
        assertAffect(BlankBed, highschool, [
            [
                "redが労働者2人を研修中として雇用しました"
            ],
            playerAffected(BlankBed, {
                ...TestPlayerRed,
                workers: TestPlayerRed.workers.concat({type: "training-human", fetched: false}, {type: "training-human", fetched: false})
            })
        ]);
    });
});