import "mocha";
import { cardEffect } from "model/interaction/game/card-effects";
import { CardName } from "model/protocol/game/card";
import { BlankBed, TestPlayerRed, available, asyncResolveFail, assertAffectResolve, unavailable } from "test/interaction/bed";
import { Game } from "model/protocol/game/game";
import { playerAffected } from "model/interaction/game/util";

describe("プレハブ工務店", () => {
    const prefabricatedBuilder = cardEffect("プレハブ工務店");
    const bed = (...cards: CardName[]) => playerAffected(BlankBed, {...TestPlayerRed, hand: cards});

    it("手札に価値10以下のカードがあれば使用可能", () => {
        available(bed("菜園"), prefabricatedBuilder);
        available(bed("鉄工所"), prefabricatedBuilder);
        available(bed("宝くじ"), prefabricatedBuilder);
        available(bed("芋畑"), prefabricatedBuilder);
        available(bed("菜園"), prefabricatedBuilder);
        available(bed("建築会社"), prefabricatedBuilder);
        available(bed("宮大工"), prefabricatedBuilder);
        available(bed("食堂"), prefabricatedBuilder);
        available(bed("旧市街"), prefabricatedBuilder);
        available(bed("墓地"), prefabricatedBuilder);
    });

    it("手札に農業系カードがないと使用不可能", () => {
        unavailable(bed("消費財"), prefabricatedBuilder);
        unavailable(bed("プレハブ工務店"), prefabricatedBuilder);
        unavailable(bed("博物館"), prefabricatedBuilder);
    });

    it("使用して価値10を超えるカードを建設しようとするとメッセージ", () => {
        asyncResolveFail(bed("宝くじ", "工業団地"), prefabricatedBuilder, {targetIndex: 1}, "そのカードは建設できません");
    });

    it("使用して価値10以下のカードを選択し、建設する", () => {
        assertAffectResolve(bed("芋畑"), prefabricatedBuilder, {targetIndex: 0}, [
            ["redが芋畑を建設しました"],
            playerAffected(BlankBed, {
                ...TestPlayerRed,
                buildings: [{card: "芋畑", workers: []}]
            })
        ]);
    });
});