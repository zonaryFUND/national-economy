import "mocha";
import assert from "power-assert";
import { cardEffect, AsyncCardEffect } from "model/interaction/game/card-effects";
import { available, BlankBed, assertAffect, TestPlayerRed } from "test/interaction/bed";
import { Game } from "model/protocol/game/game";
import { BuildRequest } from "model/interaction/game/async-command";
import { Building } from "model/protocol/game/building";
import { CardName } from "model/protocol/game/card";

describe("工業団地", () => {
    const industrialPark = cardEffect("工業団地");

    it("任意の状態で使用可能", () => {
        available(BlankBed, industrialPark); 
    });

    it("使用するとカードを3枚引く", () => {
        const bed: Game = {
            ...BlankBed,
            board: {
                ...BlankBed.board,
                deck: ["醸造所", "鉄工所", "鉄道駅"]
            }
        };
        assertAffect(bed, industrialPark, [
            ["redがカードを3枚引きました"],
            {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    players: {
                        ...BlankBed.board.players,
                        0: {
                            ...TestPlayerRed,
                            hand: ["醸造所", "鉄工所", "鉄道駅"]
                        }
                    }
                }
            }
        ]);
    });

    it("通常建設コスト5、所有する工業系建物1つごとにコスト-1", () => {
        const carpenter = cardEffect("大工") as AsyncCardEffect;
        const buildCommand = carpenter.command.name as BuildRequest;

        function assertWithBuildings(cards: CardName[], cost: number) {
            const buildings: Building[] = cards.map(c => ({card: c, workersOwner: []}));
            assert.equal(
                buildCommand.costCalclator("工業団地", {...TestPlayerRed, buildings: buildings}),
                cost,
                "コストが異なる"
            );
        }

        assertWithBuildings(["研究所", "建築会社"], 5);
        assertWithBuildings(["研究所", "工業団地"], 4);
        assertWithBuildings(["研究所", "工業団地", "工業団地"], 3);
        assertWithBuildings(["工業団地", "工業団地", "工業団地"], 2);
        assertWithBuildings(["工業団地", "工業団地", "工業団地", "工業団地"], 1);
        assertWithBuildings(["工業団地", "工業団地", "工業団地", "工業団地", "工業団地"], 0);
        assertWithBuildings(["工業団地", "工業団地", "工業団地", "工業団地", "工業団地", "工業団地"], 0);
    });
});