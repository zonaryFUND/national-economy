import "mocha";
import { available, BlankBed, TestPlayerRed, unavailable, playerAffected, assertAffect } from "../../bed";
import { cardEffect } from "model/interaction/game/card-effects";
import { Player } from "model/protocol/game/player";

describe("専門学校", () => {
    const collage = cardEffect("専門学校");

    it("労働者4人以下で使用可能", () => {
        available(BlankBed, collage);
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
        unavailable(bed, collage);
    });

    it("労働者(5+社宅-1)人以下で使用可能", () => {
        const fiveWorkersAndHousingPlayer: Player = {
            ...fiveWorkersPlayer,
            buildings: [{card: "社宅", workersOwner: []}],
        };
        const bed = playerAffected(BlankBed, fiveWorkersAndHousingPlayer);
        available(bed, collage);
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
        unavailable(bed, collage);
    });

    it("使用すると即戦力労働者を1人追加", () => {
        assertAffect(BlankBed, collage, [
            [
                "redが労働者1人を即戦力として雇用しました"
            ],
            playerAffected(BlankBed, {
                ...TestPlayerRed,
                workers: {
                    available: TestPlayerRed.workers.available + 1,
                    training: TestPlayerRed.workers.training,
                    employed: TestPlayerRed.workers.employed + 1
                }
            })
        ]);
    });
});