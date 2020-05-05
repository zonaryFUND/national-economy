import "mocha";
import { Game, GameIO } from "model/protocol/game/game";
import { BlankBed, TestPlayerRed, TestPlayerBlue } from "./bed";
import { Player } from "model/protocol/game/player";
import { fetch } from "model/interaction/game/fetching";
import { deepEqual } from "power-assert";
import { playerAffected } from "model/interaction/game/util";

describe("労働者の派遣", () => {
    const currentRed: Player = {
        ...TestPlayerRed,
        buildings: [{card: "珈琲店", workersOwner: []}, {card: "レストラン", workersOwner: []}],
        workers: {
            available: 2,
            training: 0,
            employed: 2
        }
    };
    const publicBed: Game = {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            houseHold: 20,
            deck: ["製鉄所"],
            publicBuildings: [{card: "鉱山", workersOwner: []}, {card: "露店", workersOwner: []}]
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
            ...BlankBed,
            board: {
                ...BlankBed.board,
                deck: [],
                houseHold: 20,
                publicBuildings: [{card: "鉱山", workersOwner: ["red"]}, {card: "露店", workersOwner: []}],
                players: [
                    {
                        ...currentRed,
                        hand: ["製鉄所"],
                        workers: {
                            available: 1,
                            training: 0,
                            employed: 2
                        }
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
                        buildings: [{card: "珈琲店", workersOwner: ["red"]}, {card: "レストラン", workersOwner: []}],
                        workers: {
                            available: 1,
                            training: 0,
                            employed: 2
                        }
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
                publicBuildings: [{card: "鉱山", workersOwner: []}, {card: "露店", workersOwner: ["red"]}],
                players: [
                    {
                        ...currentRed,
                        workers: {
                            available: 1,
                            training: 0,
                            employed: 2
                        }
                    },
                    TestPlayerBlue
                ]
            },
            state: {
                currentPlayer: "red",
                phase: "oncardeffect",
                effecting: "露店"
            }
        });
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
                        buildings: [{card: "珈琲店", workersOwner: []}, {card: "レストラン", workersOwner: ["red"]}],
                        workers: {
                            available: 1,
                            training: 0,
                            employed: 2
                        }
                    },
                    TestPlayerBlue
                ]
            },
            state: {
                currentPlayer: "red",
                phase: "oncardeffect",
                effecting: "レストラン"
            }
        });
    });
});