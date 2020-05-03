import "mocha";
import { available, BlankBed, TestPlayerRed, unavailable, playerAffected, assertAffect } from "../../bed";
import { cardEffect } from "model/interaction/game/card-effects";
import { Player } from "model/protocol/game/player";

describe("高等学校", () => {
    const highschool = cardEffect("高等学校");

    it("労働者3人以下で使用可能", () => {
        available(BlankBed, highschool);
    });

    const fourWorkersPlayer: Player = {
        ...TestPlayerRed,
        workers: {
            available: 4,
            training: 0,
            employed: 4
        }
    };

    it("労働者4人いると使用不可能", () => {
        const bed = playerAffected(BlankBed, fourWorkersPlayer);
        unavailable(bed, highschool);
    });

    it("労働者4人いると社宅があっても使用不可能", () => {
        const fourWorkersAndHousingPlayer: Player = {
            ...fourWorkersPlayer,
            buildings: [{card: "社宅", workersOwner: []}],
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
                workers: {
                    available: TestPlayerRed.workers.available,
                    training: TestPlayerRed.workers.training + 2,
                    employed: 4
                }
            })
        ]);
    });
});