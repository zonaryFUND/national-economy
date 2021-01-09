import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { BlankBed, TestPlayerBlue, TestPlayerRed, available, unavailable, asyncResolveFail, assertAffectResolve } from "../../bed";
import { CardName } from "model/protocol/game/card";

describe("開拓民", () => {
    const settler = cardEffect("開拓民");
    const bed = (card: CardName[]) => ({
        ...BlankBed,
        board: {
            ...BlankBed.board,
            players: [
                {
                    ...TestPlayerRed,
                    hand: card
                },
                TestPlayerBlue
            ]
        }
    });

    it("手札に農業系カードがあれば使用可能", () => {
        available(bed(["農場"]), settler);
        available(bed(["焼畑"]), settler);
        available(bed(["果樹園"]), settler);
        available(bed(["大農園"]), settler);
    });

    it("手札に農業系カードがないと使用不可能", () => {
        unavailable(bed( ["法律事務所"]), settler);
        unavailable(bed(["消費財"]), settler);
        unavailable(bed(["製鉄所"]), settler);
        unavailable(bed(["レストラン"]), settler);
    });

    it("使用して農業系でないカードを建設しようとするとメッセージ", () => {
        asyncResolveFail(
            bed(["法律事務所", "焼畑"]),
             settler, 
             {targetIndex: 0},
             "そのカードは建設できません"
        );
    });

    it("使用して農業系カードを選択し、建設する", () => {
        assertAffectResolve(bed(["農場"]), settler, {targetIndex: 0}, [
            ["redが農場を建設しました"],
            {
                ...BlankBed,
                board: {
                    ...BlankBed.board,
                    players: [
                        {
                            ...TestPlayerRed,
                            buildings: [{card: "農場", workers: []}]
                        },
                        TestPlayerBlue
                    ]
                }
            }
        ])
    });
});