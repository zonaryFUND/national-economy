import { PlayerIdentifier, Player } from "./protocol/game/player";
import { Game } from "./protocol/game/game";
import { CardName } from "./protocol/game/card";
import player from "components/room/player";
import { fisherYatesShuffle } from "./shuffle";

export function launch(players: string[], lineup?: "original" | "mecenat" | "glory"): Game {
    const ids: PlayerIdentifier[] = ["red", "blue", "orange", "purple"];
    const attendants = ids.slice(0, players.length).sort(_ => Math.random());
    const d = lineup == "mecenat" ? mecenatDeck : originalDeck;
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
            publicBuildings: publicBuildings(players.length).map(c => ({card: c, workers: []})),
            soldBuildings: []
        },
        state: {
            currentPlayer: attendants[0],
            phase: "dispatching"
        }
    };
}

function publicBuildings(players: number): CardName[] {
    const first: CardName[] = ["採石場", "鉱山", "学校"];
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

function cards(name: CardName, amount: number): CardName[] {
    return [...Array(amount)].map(_ => name);
}