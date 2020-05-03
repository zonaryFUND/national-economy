import "mocha";
import { available, BlankBed, TestPlayerRed, unavailable, playerAffected, assertAffect } from "../../bed";
import { cardEffect } from "model/interaction/game/card-effects";
import { Player } from "model/protocol/game/player";

describe("大学", () => {
    const university = cardEffect("大学");

    it("労働者4人以下で使用可能", () => {
        available(BlankBed, university);
    });

    const fiveWorkersPlayer: Player = {
        ...TestPlayerRed,
        workers: {
            available: 5,
            training: 0,
            employed: 5
        }
    };

    it("労働者5人いると使用不可能", () => {
        const bed = playerAffected(BlankBed, fiveWorkersPlayer);
        unavailable(bed, university);
    });

    it("労働者5人いると社宅があっても使用不可能", () => {
        const fiveWorkersAndHousingPlayer: Player = {
            ...fiveWorkersPlayer,
            buildings: [{card: "社宅", workersOwner: []}],
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
                workers: {
                    available: TestPlayerRed.workers.available,
                    training: TestPlayerRed.workers.training + 3,
                    employed: 5
                }
            })
        ]);
    });
});