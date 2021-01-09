import "mocha";
import { available, BlankBed, TestPlayerRed, unavailable, assertAffect } from "../../bed";
import { cardEffect } from "model/interaction/game/card-effects";
import { Player } from "model/protocol/game/player";
import { playerAffected } from "model/interaction/game/util";

describe("専門学校", () => {
    const collage = cardEffect("専門学校");

    it("労働者4人以下で使用可能", () => {
        available(BlankBed, collage);
    });

    const fiveWorkersPlayer: Player = {
        ...TestPlayerRed,
        workers: [{type: "human", fetched: false}, {type: "human", fetched: false}, {type: "human", fetched: false}, {type: "human", fetched: false}, {type: "human", fetched: false}]
    };

    it("社宅がなければ労働者5人いると使用不可能", () => {
        const bed = playerAffected(BlankBed, fiveWorkersPlayer);
        unavailable(bed, collage);
    });

    it("労働者(5+社宅-1)人以下で使用可能", () => {
        const fiveWorkersAndHousingPlayer: Player = {
            ...fiveWorkersPlayer,
            buildings: [{card: "社宅", workers: []}],
        };
        const bed = playerAffected(BlankBed, fiveWorkersAndHousingPlayer);
        available(bed, collage);
    });
    
    it("労働者が(5+社宅)人いると使用不可能", () => {
        const fiveWorkersAndFilledHousingPlayer: Player = {
            ...TestPlayerRed,
            workers: [{type: "human", fetched: false}, {type: "human", fetched: false}, {type: "human", fetched: false}, {type: "human", fetched: false}, {type: "human", fetched: false}, {type: "human", fetched: false}, {type: "human", fetched: false}],
            buildings: [{card: "社宅", workers: []}, {card: "社宅", workers: []}],
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
                workers: TestPlayerRed.workers.concat({type: "human", fetched: false})
            })
        ]);
    });
});