import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { Game } from "model/protocol/game/game";
import { BlankBed, TestPlayerRed, available, unavailable, asyncResolveFail, assertAffectResolve } from "test/interaction/bed";
import { playerAffected } from "model/interaction/game/util";

describe("地球建設", () => {
    const earthConstruction = cardEffect("地球建設");

    const availableBed: Game = {
        ...BlankBed,
        board: {
            ...BlankBed.board,
            deck: ["墓地", "大聖堂", "投資銀行"],
            players: {
                0: {
                    ...TestPlayerRed,
                    hand: ["観光牧場", "工業団地", "墓地", "消費財"],
                    buildings: [
                        {card: "工業団地", workersOwner: []},
                        {card: "工業団地", workersOwner: []},
                        {card: "工業団地", workersOwner: []},
                        {card: "工業団地", workersOwner: []}
                    ]
                }
            }
        }
    };

    it("建設できる建物が2つ以上ある場合使用可能", () => {
        available(availableBed, earthConstruction);
    });

    it("建設できる建物が2つ以上ないか、2つ分のコストを支払えない場合使用不可能", () => {
        unavailable(playerAffected(BlankBed, {
            ...TestPlayerRed,
            hand: ["観光牧場", "工業団地", "墓地", "消費財"],
        }), earthConstruction);
        unavailable(playerAffected(BlankBed, {
            ...TestPlayerRed,
            hand: ["養殖場", "工業団地", "消費財"],
        }), earthConstruction);
        unavailable(playerAffected(BlankBed, {
            ...TestPlayerRed,
            hand: ["工業団地", "消費財"],
        }), earthConstruction);
    });

    it("使用して建設対象としてコストが支払えない組み合わせを選んだ場合メッセージ", () => {
        asyncResolveFail(availableBed, earthConstruction, {built: [0, 1]}, "建設に必要なコストを支払えません");
    });

    it("使用して建設対象として建設できないカードを選んだ場合メッセージ", () => {
        asyncResolveFail(availableBed, earthConstruction, {built: [1, 3]}, "建設できないカードが含まれています");
    });

    it("使用して適切なカードを選択し、建設とコストとしての捨て札を行い、手札を使い切ればカードを3枚引く", () => {
        assertAffectResolve(availableBed, earthConstruction, {built: [1, 2], discard: [0, 3]}, [
            [
                "redが工業団地と墓地を建設しました",
                "redが手札から観光牧場、消費財1枚を捨てました",
                "redがカードを3枚引きました"
            ],
            {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    trash: ["観光牧場"],
                    players: {
                        0: {
                            ...TestPlayerRed,
                            hand: ["墓地", "大聖堂", "投資銀行"],
                            buildings: [
                                {card: "工業団地", workersOwner: []},
                                {card: "工業団地", workersOwner: []},
                                {card: "工業団地", workersOwner: []},
                                {card: "工業団地", workersOwner: []},
                                {card: "工業団地", workersOwner: []},
                                {card: "墓地", workersOwner: []}
                            ]
                        }
                    }
                }
            }
        ]);
    });

    it("使用して適切なカードを選択し、建設とコストとしての捨て札を行う", () => {
        const bed = playerAffected(availableBed, {
            ...availableBed.board.players[0],
            hand: ["観光牧場", "工業団地", "墓地", "消費財", "消費財"]
        });

        assertAffectResolve(bed, earthConstruction, {built: [1, 2], discard: [0, 3]}, [
            [
                "redが工業団地と墓地を建設しました",
                "redが手札から観光牧場、消費財1枚を捨てました"
            ],
            {
                ...BlankBed,
                board: {
                    ...availableBed.board,
                    trash: ["観光牧場"],
                    players: {
                        0: {
                            ...TestPlayerRed,
                            hand: ["消費財"],
                            buildings: [
                                {card: "工業団地", workersOwner: []},
                                {card: "工業団地", workersOwner: []},
                                {card: "工業団地", workersOwner: []},
                                {card: "工業団地", workersOwner: []},
                                {card: "工業団地", workersOwner: []},
                                {card: "墓地", workersOwner: []}
                            ]
                        }
                    }
                }
            }
        ]);
    });
});