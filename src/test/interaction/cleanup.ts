import "mocha";
import assert from "power-assert";
import { Game } from "model/protocol/game/game";
import { BlankBed, TestPlayerRed, TestPlayerBlue } from "./bed";
import { roundCleanup, isLegalSelling, resolveSelling, resolveDiscarding } from "model/interaction/game/cleanup";

describe("ラウンド終了時クリーンアップ", () => {
    it("全プレイヤーがラウンド進行度に応じた賃金を労働者1人ごとに支払い、家計へ移動する", () => {
        const bed: Game = {
            ...BlankBed,
            board: {
                ...BlankBed.board,
                currentRound: 5,
                players: [
                    {
                        ...TestPlayerRed,
                        cash: 20,
                        workers: {
                            available: 0,
                            training: 1,
                            employed: 3
                        }
                    },
                    {
                        ...TestPlayerBlue,
                        cash: 20,
                        workers: {
                            available: 0,
                            training: 1,
                            employed: 4
                        }
                    },
                    {
                        ...TestPlayerRed,
                        cash: 20,
                        id: "orange",
                        workers: {
                            available: 0,
                            training: 1,
                            employed: 5
                        }
                    },
                    {
                        ...TestPlayerRed,
                        cash: 20,
                        hand: ["農場", "農場", "農場", "農場", "農場", "農場"],
                        id: "purple",
                        workers: {
                            available: 0,
                            training: 0,
                            employed: 5
                        }
                    },
                ]
            }
        };

        const result = roundCleanup.run(bed);
        assert.deepEqual(result[0], [
            "redが従業員に賃金$9を支払いました",
            "blueが従業員に賃金$12を支払いました",
            "orangeが従業員に賃金$15を支払いました",
            "purpleが従業員に賃金$15を支払いました",
            "purpleは手札が過剰であるため、捨てる必要があります",
        ], "ログが異なる");
        const expected: Game = {
            ...bed,
            board: {
                ...bed.board,
                houseHold: 51,
                players: {
                    0: {
                        ...TestPlayerRed,
                        cash: 11,
                        workers: {
                            available: 0,
                            training: 1,
                            employed: 3
                        }
                    },
                    1: {
                        ...TestPlayerBlue,
                        cash: 8,
                        workers: {
                            available: 0,
                            training: 1,
                            employed: 4
                        }
                    },
                    2: {
                        ...TestPlayerRed,
                        cash: 5,
                        id: "orange",
                        workers: {
                            available: 0,
                            training: 1,
                            employed: 5
                        }
                    },
                    3: {
                        ...TestPlayerRed,
                        cash: 5,
                        hand: ["農場", "農場", "農場", "農場", "農場", "農場"],
                        id: "purple",
                        workers: {
                            available: 0,
                            training: 0,
                            employed: 5
                        }
                    }
                }
            },
            state: {
                red: "confirm",
                blue: "confirm",
                orange: "confirm",
                purple: "discarding"
            }
        }
        assert.deepEqual(result[1], expected, "盤面変化が異なる");
    });

    it("賃金を支払えず、売却できる建物もないプレイヤーはペナルティを負う", () => {
        const bed: Game = {
            ...BlankBed,
            board: {
                ...BlankBed.board,
                players: {
                    0: {
                        ...TestPlayerRed,
                        cash: 1,
                        buildings: [{card: "不動産屋", workersOwner: []}],
                        workers: {available: 0, training: 0, employed: 2}
                    }
                }
            }
        };
        const result = roundCleanup.run(bed);
        assert.deepEqual(result[0], [
            "redは売却できる建物がなく賃金$4を支払えないため、未払い賃金$3ぶんの罰が課されます！"
        ], "ログが異なる");
        const expected: Game = {
            ...bed,
            board: {
                ...bed.board,
                houseHold: 1,
                players: {
                    0: {
                        ...TestPlayerRed,
                        buildings: [{card: "不動産屋", workersOwner: []}],
                        workers: {available: 0, training: 0, employed: 2},
                        penalty: 3
                    }
                }
            },
            state: {
                red: "confirm"
            }
        };
        assert.deepEqual(result[1], expected, "盤面変化が異なる")
    });

    const sellingBed: Game = {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            currentRound: 5,
            players: {
                0: {
                    ...TestPlayerRed,
                    cash: 1,
                    workers: {available: 0, training: 0, employed: 5},
                    buildings: [
                        {card: "不動産屋", workersOwner: []}, 
                        {card: "化学工場", workersOwner: []},
                        {card: "農場", workersOwner: []},
                        {card: "農場", workersOwner: []},
                        {card: "農場", workersOwner: []},
                        {card: "工場", workersOwner: []}
                    ]
                }
            }
        },
        state: {
            red: "selling"
        }
    };

    it("賃金を支払う現金がないプレイヤーは建物売却フェーズに入る", () => {
        const result = roundCleanup.run(sellingBed);
        assert.deepEqual(result[0], ["redは現金が必要賃金に足りないため、建物を売却する必要があります"], "ログが異なる");
        assert.deepEqual(result[1], {
            ...sellingBed,
            state: {
                red: "selling"
            }
        }, "盤面変化が異なる");
    });

    it("売却可能建物の資産価値が十分であるとき、過剰売却は禁止される", () => {
        assert.equal(isLegalSelling(sellingBed, "red", [1]), true);
        assert.equal(isLegalSelling(sellingBed, "red", [1, 2]), false);
        assert.equal(isLegalSelling(sellingBed, "red", [2, 3, 4]), true);
        assert.equal(isLegalSelling(sellingBed, "red", [2, 3, 4, 5]), false);
        assert.equal(isLegalSelling(sellingBed, "red", [3, 4, 5]), false);
    });

    it("建物の売却を終了すると賃金を支払い、手札が少なければ待機フェーズに入る", () => {
        const result = resolveSelling("red", [2, 3, 4]).run(sellingBed);
        assert.deepEqual(result[0], [
            "redは農場、農場、農場を売却して$18を獲得しました",
            "redが従業員に賃金$15を支払いました"
        ], "ログが異なる");
        assert.deepEqual(result[1], {
            ...BlankBed,
            board: {
                ...BlankBed.board,
                houseHold: 15,
                currentRound: 5,
                soldBuildings: [
                    {card: "農場", workersOwner: []},
                    {card: "農場", workersOwner: []},
                    {card: "農場", workersOwner: []},
                ],
                players: {
                    0: {
                        ...TestPlayerRed,
                        cash: 4,
                        workers: {available: 0, training: 0, employed: 5},
                        buildings: [
                            {card: "不動産屋", workersOwner: []}, 
                            {card: "化学工場", workersOwner: []},
                            {card: "工場", workersOwner: []}
                        ]
                    }
                }
            },
            state: {
                red: "finish"
            }
        }, "盤面変化が異なる");
    });

    const discardingBed: Game = {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            players: {
                0: {
                    ...TestPlayerRed,
                    cash: 10,
                    workers: {available: 0, training: 0, employed: 2},
                    hand: ["化学工場", "消費財", "工場", "本社ビル", "珈琲店", "設計事務所", "農場"]
                }
            }
        }
    };

    it("賃金の支払い後に手札が過剰であれば捨て札フェーズに入る", () => {
        const result = roundCleanup.run(discardingBed);
        assert.deepEqual(result[0], [
            "redが従業員に賃金$4を支払いました",
            "redは手札が過剰であるため、捨てる必要があります"
        ], "ログが異なる");
        assert.deepEqual(result[1], {
            board: {
                ...discardingBed.board,
                houseHold: 4,
                players: {
                    0: {
                        ...discardingBed.board.players[0],
                        cash: 6
                    }
                }
            },
            state: {
                red: "discarding"
            }
        }, "盤面変化が異なる");
    });

    it("倉庫があると手札上限が増える", () => {
        const bed: Game = {
            ...discardingBed,
            board: {
                ...discardingBed.board,
                players: {
                    0: {
                        ...discardingBed.board.players[0],
                        buildings: [{card: "倉庫", workersOwner: []}]
                    }
                }
            }
        }
        const result = roundCleanup.run(bed);
        assert.deepEqual(result[0], ["redが従業員に賃金$4を支払いました"], "ログが異なる");
        assert.deepEqual(result[1], {
            board: {
                ...bed.board,
                houseHold: 4,
                players: {
                    0: {
                        ...bed.board.players[0],
                        cash: 6
                    }
                }
            },
            state: {
                red: "confirm"
            }
        }, "盤面変化が異なる");
    });

    it("捨て札を確定させる", () => {
        const bed: Game = {
            ...discardingBed,
            state: {
                red: "discarding"
            }
        };
        const result = resolveDiscarding("red", [1, 3]).run(bed);
        assert.deepEqual(result[0], ["redが手札から本社ビル、消費財1枚を捨てました"], "ログが異なる");
        assert.deepEqual(result[1], {
            board: {
                ...discardingBed.board,
                trash: ["本社ビル"],
                players: {
                    0: {
                        ...discardingBed.board.players[0],
                        hand: ["化学工場", "工場", "珈琲店", "設計事務所", "農場"]
                    }
                }
            },
            state: {
                red: "finish"
            }
        }, "盤面変化が異なる");
    });
});