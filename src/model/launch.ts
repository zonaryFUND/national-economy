import { PlayerIdentifier, Player } from "./protocol/game/player";
import { Game } from "./protocol/game/game";
import { CardName } from "./protocol/game/card";
import player from "components/room/player";
import { fisherYatesShuffle } from "./shuffle";

export function launch(players: string[], lineup?: "original" | "mecenat" | "glory"): Game {
    const ids: PlayerIdentifier[] = ["red", "blue", "orange", "purple"];
    const attendants = ids.slice(0, players.length).sort(_ => Math.random());
    const deck = fisherYatesShuffle(originalDeck);

    const p: Player[] = attendants.map((id, i) => ({
        id: id,
        name: players[i],
        hand: deck.slice(3 * i, 3 * (i + 1)),
        workers: {
            available: 2,
            training: 0,
            employed: 2
        },
        buildings: [],
        cash: 5 + i,
        penalty: 0
    }));

    return {
        board: {
            currentRound: 1,
            deck: deck.slice(player.length * 3),
            trash: [],
            houseHold: 0,
            players: p,
            startPlayer: attendants[0],
            publicBuildings: publicBuildings(players.length).map(c => ({card: c, workersOwner: []})),
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

function cards(name: CardName, amount: number): CardName[] {
    return [...Array(amount)].map(_ => name);
}