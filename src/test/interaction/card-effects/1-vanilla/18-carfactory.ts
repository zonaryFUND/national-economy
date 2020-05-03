import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { BlankBed, TestPlayerRed, available, TestPlayerBlue, unavailable, assertAffectIOResolve, asyncResolveFail } from "../../bed";
import { Player } from "model/protocol/game/player";
import { Game, GameIO } from "model/protocol/game/game";
import { playerAffected } from "model/interaction/game/util";

describe("自動車工場", () => {
    const carFactory = cardEffect("自動車工場");
    const fourHandPlayer: Player = {...TestPlayerRed, hand: ["不動産屋", "化学工場", "労働組合", "消費財"]};
    const availableBed: Game = {
        ...BlankBed, 
        board: {
            ...BlankBed.board, 
            deck: ["焼畑", "珈琲店", "大農園", "設計事務所"],
            players: [fourHandPlayer, TestPlayerBlue]
        }
    };

    it("手札3枚以上で使用可能", () => {
        available(availableBed, carFactory);
        available(playerAffected(BlankBed, fourHandPlayer), carFactory);
    });

    it("手札3枚未満で使用不可能", () => {
        unavailable({
            ...availableBed,
            board: {...availableBed.board, players: [TestPlayerRed, TestPlayerBlue]}
        }, carFactory);
    });

    it("使用して捨て札を3枚選択し、カードを7枚引く", () => {
        const io: GameIO = {
            game: availableBed,
            shuffle: array => array.reverse()
        };

        assertAffectIOResolve(io, carFactory, {targetHandIndices: [0, 1, 2]}, [
            [
                "redが手札から不動産屋、化学工場、労働組合を捨てました",
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
                            hand: ["消費財", "焼畑", "珈琲店", "大農園", "設計事務所", "労働組合", "化学工場", "不動産屋"]
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

        assertAffectIOResolve(io, carFactory, {targetHandIndices: [0, 1, 2]}, [
            [
                "redが手札から不動産屋、化学工場、労働組合を捨てました",
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
                            hand: ["消費財", "労働組合", "化学工場", "不動産屋", "消費財", "消費財", "消費財", "消費財"]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ]);
    });
});