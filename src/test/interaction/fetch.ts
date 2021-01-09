import "mocha";
import { Game, GameIO } from "model/protocol/game/game";
import { BlankBed, TestPlayerRed, TestPlayerBlue } from "./bed";
import { Player } from "model/protocol/game/player";
import { fetch, cancelFetching } from "model/interaction/game/fetching";
import { deepEqual } from "power-assert";
import { playerAffected } from "model/interaction/game/util";
import { build } from "model/interaction/game/sync-effect";
import { Board } from "model/protocol/game/board";

describe("労働者の派遣", () => {
    const currentRed: Player = {
        ...TestPlayerRed,
        buildings: [{card: "珈琲店", workers: []}, {card: "レストラン", workers: []}],
        workers: [{type: "human", fetched: false}, {type: "human", fetched: false}]
    };
    const publicBed: Game = {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            houseHold: 20,
            deck: ["製鉄所"],
            publicBuildings: [{card: "鉱山", workers: []}, {card: "露店", workers: []}],
            soldBuildings: [{card: "ゼネコン", workers: []}, {card: "工場", workers: []}]
        }
    };
    const io: GameIO = {
        game: playerAffected(publicBed, currentRed),
        shuffle: array => array
    };

    it("公共の即時効果の職場へ派遣すると、公共職場の労働者が1人増えて職場の効果を即発動", () => {  
        const state = fetch("public", 0);
        const result = state.run(io);
        const to = result[1].game;
        deepEqual(result[0], [
            "redが公共の鉱山に労働者を派遣しました",
            "redがカードを1枚引きました"
        ]);
        deepEqual(to, {
            ...publicBed,
            board: {
                ...publicBed.board,
                deck: [],
                houseHold: 20,
                publicBuildings: [{card: "鉱山", workers: [{owner: "red", type: "human"}]}, {card: "露店", workers: []}],
                players: [
                    {
                        ...currentRed,
                        hand: ["製鉄所"],
                        workers: [{type: "human", fetched: true}, {type: "human", fetched: false}]
                    },
                    TestPlayerBlue
                ]
            }
        });
    });

    it("占有の即時効果の職場へ派遣すると、占有職場の労働者が1人増えて職場の効果を即発動", () => {  
        const state = fetch("occupied", 0);
        const result = state.run(io);
        const to = result[1].game;
        deepEqual(result[0], [
            "redが所有する珈琲店に労働者を派遣しました",
            "redが家計から$5を獲得しました"
        ]);
        deepEqual(to, {
            ...publicBed,
            board: {
                ...publicBed.board,
                houseHold: 15,
                players: [
                    {
                        ...currentRed,
                        cash: 5,
                        buildings: [{card: "珈琲店", workers: [{owner: "red", type: "human"}]}, {card: "レストラン", workers: []}],
                        workers: [{type: "human", fetched: true}, {type: "human", fetched: false}]
                    },
                    TestPlayerBlue
                ]
            }
        });
    });

    it("公共の非即時効果の職場へ派遣すると、公共職場の労働者が1人増えて職場の効果の確定待ち", () => {  
        const state = fetch("public", 1);
        const result = state.run(io);
        const to = result[1].game;
        deepEqual(result[0], [
            "redが公共の露店に労働者を派遣しました"
        ]);
        deepEqual(to, {
            ...publicBed,
            board: {
                ...publicBed.board,
                publicBuildings: [{card: "鉱山", workers: []}, {card: "露店", workers: [{owner: "red", type: "human"}]}],
                players: [
                    {
                        ...currentRed,
                        workers: [{type: "human", fetched: true}, {type: "human", fetched: false}]
                    },
                    TestPlayerBlue
                ]
            },
            state: {
                currentPlayer: "red",
                phase: "oncardeffect",
                effecting: {
                    card: "露店",
                    address: {
                        to: "public",
                        index: 1
                    }
                }
            }
        });
    });

    it("公共の非即時効果の職場へ派遣したあとにキャンセルすると、元の状態に戻る", () => {
        const fetching = fetch("public", 1);
        const med = fetching.run(io);
        const result = cancelFetching.run(med[1]);
        deepEqual(result[0], [
            "redが派遣を取り消しました"
        ]);
        deepEqual(result[1].game, io.game);
    });

    it("売却済みの非即時効果の職場へ派遣すると、当該職場の労働者が1人増えて職場の効果の確定待ち", () => {
        const state = fetch("sold", 1);
        const result = state.run(io);
        const to = result[1].game;
        deepEqual(result[0], [
            "redが公共の工場に労働者を派遣しました"
        ]);
        deepEqual(to, {
            ...publicBed,
            board: {
                ...publicBed.board,
                soldBuildings: [{card: "ゼネコン", workers: []}, {card: "工場", workers: [{owner: "red", type: "human"}]}],
                players: [
                    {
                        ...currentRed,
                        workers: [{type: "human", fetched: true}, {type: "human", fetched: false}]
                    },
                    TestPlayerBlue
                ],
            },
            state: {
                currentPlayer: "red",
                phase: "oncardeffect",
                effecting: {
                    card: "工場",
                    address: {
                        to: "sold",
                        index: 1
                    }
                }
            }
        });
    });

    it("売却済みの非即時効果の職場へ派遣したあとにキャンセルすると、元の状態に戻る", () => {
        const fetching = fetch("sold", 1);
        const med = fetching.run(io);
        const result = cancelFetching.run(med[1]);
        deepEqual(result[0], [
            "redが派遣を取り消しました"
        ]);
        deepEqual(result[1].game, io.game);
    });


    it("占有の非即時効果の職場へ派遣すると、占有職場の労働者が1人増えて職場の効果の確定待ち", () => {  
        const state = fetch("occupied", 1);
        const result = state.run(io);
        const to = result[1].game;
        deepEqual(result[0], [
            "redが所有するレストランに労働者を派遣しました"
        ]);
        deepEqual(to, {
            ...publicBed,
            board: {
                ...publicBed.board,
                players: [
                    {
                        ...currentRed,
                        buildings: [{card: "珈琲店", workers: []}, {card: "レストラン", workers: [{owner: "red", type: "human"}]}],
                        workers: [{type: "human", fetched: true}, {type: "human", fetched: false}]
                    },
                    TestPlayerBlue
                ]
            },
            state: {
                currentPlayer: "red",
                phase: "oncardeffect",
                effecting: {
                    card: "レストラン",
                    address: {
                        to: "mine",
                        index: 1
                    }
                }
            }
        });
    });

    it("専有の非即時効果の職場へ派遣したあとにキャンセルすると、元の状態に戻る", () => {
        const fetching = fetch("occupied", 1);
        const med = fetching.run(io);
        const result = cancelFetching.run(med[1]);
        deepEqual(result[0], [
            "redが派遣を取り消しました"
        ]);
        deepEqual(result[1].game, io.game);
    });
});