import "mocha";

import { BlankBed, available, unavailable, assertAffect, TestPlayerBlue, TestPlayerRed, assertAffectIO } from "../../bed";
import { Game, GameIO } from "model/protocol/game/game";
import { cardEffect } from "model/interaction/game/card-effects";

describe("採石場", () => {
    const quarry = cardEffect("採石場");
    const availableBed: Game = {...BlankBed, board: {...BlankBed.board, deck: ["自動車工場"]}};

    it("任意の状態で使用可能", () => {
        available(BlankBed, quarry);
    });

    it("スタートプレイヤーが使用すると1ドロー、ログは出る", () => {
        assertAffect(availableBed, quarry, [
            [
                "redがカードを1枚引きました", 
                "redが次ラウンドのスタートプレイヤーになりました"
            ],
            {
                ...availableBed,
                board: {
                    ...availableBed.board,
                    deck: [],
                    players: [
                        {
                            ...TestPlayerRed,
                            hand: ["自動車工場"]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ]);
    });

    it("デッキ0枚でスタートプレイヤーが使用すると消費財1ドロー、ログは出る", () => {
        assertAffect(BlankBed, quarry, [
            [
                "redが消費財を1枚引きました(山札、捨て札切れ)", 
                "redが次ラウンドのスタートプレイヤーになりました"
            ],
            {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    players: [
                        {
                            ...TestPlayerRed,
                            hand: ["消費財"]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ]);
    });

    const trashBed: Game = ({...BlankBed, board: {...BlankBed.board, trash: ["不動産屋"]}});
    it("デッキ0枚、捨て札1枚でスタートプレイヤーが使用するとシャッフルして1ドロー、ログは出る", () => {
        const trashIO: GameIO = {
            game: trashBed,
            shuffle: array => array
        };

        assertAffectIO(trashIO, quarry, [
            [
                "捨て札がシャッフルされ山札の下に補充されました",
                "redがカードを1枚引きました", 
                "redが次ラウンドのスタートプレイヤーになりました"
            ],
            {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    players: [
                        {
                            ...TestPlayerRed,
                            hand: ["不動産屋"]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ]);
    });

    it("非スタートプレイヤーが使用すると1ドローしてスタートプレイヤー移動", () => {
        const currentBluePlayerBed: Game = {...availableBed, state: {currentPlayer: "blue", phase: "dispatching"}};
        assertAffect(currentBluePlayerBed, quarry, [
            [   
                "blueがカードを1枚引きました",
                "blueが次ラウンドのスタートプレイヤーになりました"
            ],
            {
                ...currentBluePlayerBed,
                board: {
                    ...currentBluePlayerBed.board,
                    deck: [],
                    players: [
                        TestPlayerRed,
                        {
                            ...TestPlayerBlue,
                            hand: ["自動車工場"]
                        }
                    ],
                    startPlayer: "blue"
                }
            }
        ]);
    })
});