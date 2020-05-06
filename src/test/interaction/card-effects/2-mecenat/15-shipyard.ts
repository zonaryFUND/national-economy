import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { Player } from "model/protocol/game/player";
import { TestPlayerRed, BlankBed, available, unavailable, assertAffectIOResolve } from "test/interaction/bed";
import { Game, GameIO } from "model/protocol/game/game";

describe("造船所", () => {
    const shipyard = cardEffect("造船所");
    const fourHandPlayer: Player = {...TestPlayerRed, hand: ["研究所", "芋畑", "菜園", "観光牧場"]};
    const availableBed: Game = {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            deck: ["輸出港", "遊園地", "醸造所"],
            players: {
                0: fourHandPlayer
            }
        }
    };

    it("手札3枚以上で使用可能", () => {
        available(availableBed, shipyard); 
    });

    it("手札3枚未満で使用不可能", () => {
        unavailable(BlankBed, shipyard);
    });

    it("使用して捨て札を3枚選択し、カードを6枚引く", () => {
        const io: GameIO = {
            game: availableBed,
            shuffle: array => array.reverse()
        };

        assertAffectIOResolve(io, shipyard, {targetHandIndices: [0, 1, 2]}, [
            [
                "redが手札から研究所、芋畑、菜園を捨てました",
                "捨て札がシャッフルされ山札の下に補充されました",
                "redがカードを6枚引きました"
            ],
            {
                ...availableBed,
                board: {
                    ...availableBed.board,
                    deck: [],
                    trash: [],
                    players: {
                        0: {
                            ...fourHandPlayer,
                            hand: ["観光牧場", "輸出港", "遊園地", "醸造所", "菜園", "芋畑", "研究所"]
                        }
                    }
                }
            }
        ]);
    });
});