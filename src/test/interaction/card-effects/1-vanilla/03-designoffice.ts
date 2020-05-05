import "mocha";
import assert from "power-assert";
import { cardEffect } from "model/interaction/game/card-effects";
import { Game, GameIO } from "model/protocol/game/game";
import { BlankBed, available, unavailable, assertAffectResolve, TestPlayerBlue, TestPlayerRed, assertAffectIOResolve, assertAffectIO } from "../../bed";
import { fetch } from "model/interaction/game/fetching";

describe("設計事務所", () => {
    const designOffice = cardEffect("設計事務所");
    const availableBed: Game = {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            deck: [
                "社宅",
                "自動車工場",
                "製鉄所",
                "設計事務所",
                "農協"
            ]
        }
    };

    it("任意の状態で使用可能", () => {
        available(BlankBed, designOffice);
    });

    it("使用すると中継状態に公開された5枚のカードを置く", () => {
        const io: GameIO = {
            game: {
                ...availableBed,
                board: {
                    ...availableBed.board,
                    soldBuildings: [{card: "設計事務所", workersOwner: []}]
                }
            },
            shuffle: array => array
        }
        const fetchState = fetch("sold", 0);
        const result = fetchState.run(io);
        assert.deepEqual(result[0], ["redが公共の設計事務所に労働者を派遣しました"], "ログが異なる");
        assert.deepEqual({
            ...BlankBed,
            board: {
                ...io.game.board,
                deck: [],
                soldBuildings: [{card: "設計事務所", workersOwner: ["red"]}],
                players: {
                    0: {
                        ...TestPlayerRed,
                        workers: {
                            ...TestPlayerRed.workers,
                            available: 1
                        }
                    },
                    1: TestPlayerBlue
                }
            },
            state: {
                currentPlayer: "red",
                phase: "oncardeffect",
                effecting: "設計事務所",
                revealing: ["社宅", "自動車工場", "製鉄所", "設計事務所", "農協"]
            }
        }, result[1].game, "盤面変化が異なる")
    });

    it("使用して選んだ1枚を手札に加え、残りを捨て札にする", () => {
        const bed: Game = {
            ...availableBed,
            board: {
                ...availableBed.board,
                deck: []
            },
            state: {
                currentPlayer: "red",
                phase: "oncardeffect",
                effecting: "設計事務所",
                revealing: ["社宅", "自動車工場", "製鉄所", "設計事務所", "農協"]
            }
        }
        assertAffectResolve(bed, designOffice, {targetIndex: 2}, [
            ["redが山札の上から社宅、自動車工場、製鉄所、設計事務所、農協をめくり、製鉄所を手札に加えて残りを捨て札にしました"],
            {
                ...bed,
                board: {
                    ...BlankBed.board,
                    trash: ["社宅", "自動車工場", "設計事務所", "農協"],
                    players: {
                        0: {
                            ...TestPlayerRed,
                            hand: ["製鉄所"]
                        },
                        1: TestPlayerBlue
                    }
                }
            }
        ]);
    });

    /*
    it("山札と捨て札の合計が5に満たない場合、消費財を含めて5枚の選択肢から選んだ1枚を手札に加え、残りを捨て札にする", () => {
        const bed: Game = {
            ...BlankBed,
            board: {
                ...BlankBed.board,
                deck: ["レストラン", "ゼネコン"],
                trash: ["倉庫"]
            }
        };

        const shuffleIO: GameIO = {
            game: bed,
            shuffle: array => array.reverse()
        };

        assertAffectIOResolve(shuffleIO, designOffice, {targetIndex: 1}, [
            [
                "捨て札がシャッフルされ、山札の下に補充されました",
                "redが山札の上からレストラン、ゼネコン、倉庫、消費財2枚をめくり、ゼネコンを手札に加えて残りを捨て札にしました"
            ],
            {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    trash: ["レストラン", "倉庫"],
                    players: {
                        0: {
                            ...TestPlayerRed,
                            hand: ["ゼネコン"]
                        },
                        1: TestPlayerBlue
                    }
                }
            }
        ]);
    });

    it("シャッフルが必要なときに使用するとそうした上で山札の上から5枚見る", () => {
        const shuffleBed: Game = {
            ...BlankBed,
            board: {
                ...BlankBed.board,
                deck: [
                    "社宅",
                    "自動車工場",
                    "製鉄所"
                ],
                trash: [
                    "設計事務所",
                    "農協"
                ]
            }
        };
        const shuffleIO: GameIO = {
            game: shuffleBed,
            shuffle: array => array.reverse()
        };


        assertAffectIOResolve(shuffleIO, designOffice, [
            [
                "捨て札がシャッフルされ、山札の下に補充されました"
            ],
            {
                ...availableBed,
                board: {
                    ...BlankBed.board,
                    deck: [],
                    trash: [],
                    players: {
                        0: {
                            ...TestPlayerRed,
                            hand: ["製鉄所"]
                        },
                        1: TestPlayerBlue
                    }
                },
                state: {
                    currentPlayer: "red",
                    phase: "oncardeffect",
                    effecting: "設計事務所",
                    revealing: ["社宅", "自動車工場", "製鉄所", "農協", "設計事務所"]
                }
            }
        ]);
    });
    */
});