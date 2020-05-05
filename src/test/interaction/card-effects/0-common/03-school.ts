import "mocha";
import { available, BlankBed, TestPlayerRed, TestPlayerBlue, unavailable, assertAffect } from "../../bed";
import { cardEffect } from "model/interaction/game/card-effects";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("学校", () => {
    const school = cardEffect("学校");

    it("労働者4人以下で使用可能", () => {
        available(BlankBed, school);
    });

    const fiveWorkersPlayer: Player = {
        ...TestPlayerRed,
        workers: {
            available: 5,
            training: 0,
            employed: 5
        }
    };

    it("社宅がなければ労働者5人いると使用不可能", () => {
        const bed = playerAffected(BlankBed, fiveWorkersPlayer);
        unavailable(bed, school);
    });

    it("労働者(5+社宅-1)人以下で使用可能", () => {
        const fiveWorkersAndHousingPlayer: Player = {
            ...fiveWorkersPlayer,
            buildings: [{card: "社宅", workersOwner: []}],
        };
        const bed = playerAffected(BlankBed, fiveWorkersAndHousingPlayer);
        available(bed, school);
    });
    
    it("労働者が(5+社宅)人いると使用不可能", () => {
        const fiveWorkersAndFilledHousingPlayer: Player = {
            ...TestPlayerRed,
            workers: {
                available: 6,
                training: 1,
                employed: 7
            },
            buildings: [{card: "社宅", workersOwner: []}, {card: "社宅", workersOwner: []}],
        };
        const bed = playerAffected(BlankBed, fiveWorkersAndFilledHousingPlayer);
        unavailable(bed, school);
    });

    it("使用すると研修中労働者を1人追加", () => {
        assertAffect(BlankBed, school, [
            [
                "redが労働者1人を研修中として雇用しました"
            ],
            playerAffected(BlankBed, {
                ...TestPlayerRed,
                workers: {
                    available: TestPlayerRed.workers.available,
                    training: TestPlayerRed.workers.training + 1,
                    employed: TestPlayerRed.workers.employed + 1
                }
            })
        ]);
    });
});