import "mocha";
import assert from "power-assert";
import { cardEffect, AsyncCardEffect } from "model/interaction/game/card-effects";
import { BlankBed, TestPlayerRed, available, TestPlayerBlue, unavailable, assertAffectIOResolve, asyncResolveFail } from "../../bed";
import { Player } from "model/protocol/game/player";
import { Game, GameIO } from "model/protocol/game/game";
import { playerAffected } from "model/interaction/game/util";
import { BuildRequest } from "model/interaction/game/async-command";

describe("機関車工場", () => {
    const locomotiveFactory = cardEffect("機関車工場");
    const fourHandPlayer: Player = {...TestPlayerRed, hand: ["モダニズム建設", "劇場", "収穫祭", "工房"]};
    const availableBed: Game = {
        ...BlankBed, 
        board: {
            ...BlankBed.board, 
            deck: ["技術展示会", "摩天建設", "植民団", "浄火の神殿"],
            players: [fourHandPlayer, TestPlayerBlue]
        }
    };

    it("手札3枚以上で使用可能", () => {
        available(availableBed, locomotiveFactory);
        available(playerAffected(BlankBed, fourHandPlayer), locomotiveFactory);
    });

    it("手札3枚未満で使用不可能", () => {
        unavailable({
            ...availableBed,
            board: {...availableBed.board, players: [TestPlayerRed, TestPlayerBlue]}
        }, locomotiveFactory);
    });

    it("使用して捨て札を3枚選択し、カードを7枚引く", () => {
        const io: GameIO = {
            game: availableBed,
            shuffle: array => array.reverse()
        };

        assertAffectIOResolve(io, locomotiveFactory, {targetHandIndices: [0, 1, 2]}, [
            [
                "redが手札からモダニズム建設、劇場、収穫祭を捨てました",
                "捨て札がシャッフルされ山札の下に補充されました",
                "redがカードを7枚引きました"
            ],
            {
                ...availableBed,
                board: {
                    ...availableBed.board,
                    deck: [],
                    trash: [],
                    players: [
                        {
                            ...fourHandPlayer,
                            hand: ["工房", "技術展示会", "摩天建設", "植民団", "浄火の神殿", "収穫祭", "劇場", "モダニズム建設"]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ]);
    });

    it("デッキ+捨て札の枚数が4未満のとき、不足分を消費財ドロー", () => {
        const io: GameIO = {
            game: playerAffected(BlankBed, fourHandPlayer),
            shuffle: array => array.reverse()
        };

        assertAffectIOResolve(io, locomotiveFactory, {targetHandIndices: [0, 1, 2]}, [
            [
                "redが手札からモダニズム建設、劇場、収穫祭を捨てました",
                "捨て札がシャッフルされ山札の下に補充されました",
                "redがカードを3枚、消費財を4枚引きました(山札、捨て札切れ)"
            ],
            {
                ...availableBed,
                board: {
                    ...availableBed.board,
                    deck: [],
                    trash: [],
                    players: [
                        {
                            ...fourHandPlayer,
                            hand: ["工房", "収穫祭", "劇場", "モダニズム建設", "消費財", "消費財", "消費財", "消費財"]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ]);
    });

    it("5枚以上の勝利点トークンを所有していると建設コスト4、所有していないと建設コスト7", () => {
        const carpenter = cardEffect("大工") as AsyncCardEffect;
        const buildCommand = carpenter.command.name as BuildRequest;

        assert.equal(buildCommand.costCalclator("機関車工場", 
        {...TestPlayerRed, victoryToken: 4}), 7, "通常コストが異なる");
        assert.equal(buildCommand.costCalclator("機関車工場", 
        {...TestPlayerRed, victoryToken: 5}), 4, "軽減後コストが異なる");
    });
});