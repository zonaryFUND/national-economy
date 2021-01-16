import { PlayerIdentifier, Player } from "./protocol/game/player";
import { Game } from "./protocol/game/game";
import { CardName } from "./protocol/game/card";
import player from "components/room/player";
import { fisherYatesShuffle } from "./shuffle";

export function launch(players: string[], lineup: "original" | "mecenat" | "glory"): Game {
    const ids: PlayerIdentifier[] = ["red", "blue", "orange", "purple"];
    const attendants = fisherYatesShuffle(ids.slice(0, players.length));
    const d = (() => {
        switch (lineup) {
            case "original":
                return originalDeck;
            case "mecenat":
                return mecenatDeck;
            case "glory":
                return gloryDeck;
        }
    })();
    const deck = fisherYatesShuffle(fisherYatesShuffle(fisherYatesShuffle(fisherYatesShuffle(fisherYatesShuffle(d)))));

    const p: {[index: number]: Player} = fisherYatesShuffle(fisherYatesShuffle(fisherYatesShuffle(fisherYatesShuffle(fisherYatesShuffle(attendants))))).reduce((prev, id, i) => {
        const player: Player = {
            id: id,
            name: players[i],
            hand: deck.slice(3 * i, 3 * (i + 1)),
            workers: [{type: "human", fetched: false}, {type: "human", fetched: false}],
            buildings: [],
            cash: 5 + i,
            reservedCards: [],
            victoryToken: 0,
            penalty: 0
        };
        return {...prev, [i]: player};
    }, {});

    return {
        board: {
            currentRound: 1,
            deck: deck.slice(player.length * 3),
            trash: [],
            houseHold: 0,
            players: p,
            startPlayer: attendants[0],
            publicBuildings: publicBuildings(players.length, lineup == "glory").map(c => ({card: c, workers: []})),
            soldBuildings: []
        },
        state: {
            currentPlayer: attendants[0],
            phase: "dispatching"
        }
    };
}

function publicBuildings(players: number, glory: boolean): CardName[] {
    const first = (() => {
        if (glory) {
            return ["採石場", "鉱山", "学校", "遺跡"] as CardName[]
        } else {
            return ["採石場", "鉱山", "学校"] as CardName[]
        }
    })();
    const carpenters: CardName[] = [...Array(Math.max(players - 1, 1))].map(_ => "大工");
    const last: CardName[] = ["露店", "市場", "高等学校", "スーパーマーケット", "大学", "百貨店", "専門学校", "万博"];
    return first.concat(...carpenters, ...last);    
}

const originalDeck: CardName[] = [
    ...cards("農場", 8),
    ...cards("焼畑", 2),
    ...cards("設計事務所", 4),
    ...cards("珈琲店", 2),
    ...cards("果樹園", 3),
    ...cards("工場", 8),
    ...cards("建設会社", 4),
    ...cards("倉庫", 3),
    ...cards("法律事務所", 1),
    ...cards("大農園", 3),
    ...cards("レストラン", 2),
    ...cards("開拓民", 2),
    ...cards("不動産屋", 2),
    ...cards("製鉄所", 3),
    ...cards("ゼネコン", 3),
    ...cards("農協", 1),
    ...cards("労働組合", 1),
    ...cards("自動車工場", 3),
    ...cards("鉄道", 1),
    ...cards("本社ビル", 1),
    ...cards("社宅", 2),
    ...cards("邸宅", 1),
    ...cards("化学工場", 2),
    ...cards("二胡市建設", 2)
];

const mecenatDeck: CardName[] = [
    ...cards("菜園", 4),
    ...cards("鉄工所", 3),
    ...cards("宝くじ", 2),
    ...cards("遊園地", 2),
    ...cards("芋畑", 6),
    ...cards("観光牧場", 2),
    ...cards("建築会社", 2),
    ...cards("研究所", 2),
    ...cards("食品工場", 8),
    ...cards("醸造所", 2),
    ...cards("地球建設", 3),
    ...cards("石油コンビナート", 2),
    ...cards("大聖堂", 3),
    ...cards("宮大工", 5),
    ...cards("造船所", 3),
    ...cards("工業団地", 2),
    ...cards("食堂", 2),
    ...cards("プレハブ工務店", 2),
    ...cards("養殖場", 6),
    ...cards("旧市街", 3),
    ...cards("会計事務所", 1),
    ...cards("墓地", 2),
    ...cards("輸出港", 1),
    ...cards("鉄道駅", 2),
    ...cards("投資銀行", 1),
    ...cards("植物園", 1),
    ...cards("博物館", 1)
];

const gloryDeck: CardName[] = [
    ...cards("遺物", 3),
    ...cards("農村", 6),
    ...cards("植民団", 5),
    ...cards("工房", 5),
    ...cards("蒸気工場", 8),
    ...cards("養鶏場", 4),
    ...cards("摩天建設", 3),
    ...cards("ゲームカフェ", 3),
    ...cards("綿花農場", 3),
    ...cards("美術館", 2),
    ...cards("記念碑", 2),
    ...cards("消費者組合", 1),
    ...cards("機械人形", 5),
    ...cards("炭鉱", 2),
    ...cards("モダニズム建設", 2),
    ...cards("劇場", 2),
    ...cards("ギルドホール", 1),
    ...cards("象牙の塔", 1),
    ...cards("精錬所", 3),
    ...cards("転送装置", 2),
    ...cards("革命広場", 1),
    ...cards("収穫祭", 1),
    ...cards("技術展示会", 1),
    ...cards("温室", 2),
    ...cards("浄火の神殿", 1),
    ...cards("機関車工場", 2)
];

function cards(name: CardName, amount: number): CardName[] {
    return [...Array(amount)].map(_ => name);
}