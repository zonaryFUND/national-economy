import { CardName } from "model/protocol/game/card";
import { gainVictoryTokens, EffectLog, SyncEffect } from "./sync-effect";
import State from "monad/state/state";
import { GameIO, getCurrentPlayer } from "model/protocol/game/game";
import { maxWorkers } from "./util";
import { Player } from "model/protocol/game/player";
import { onCurrentPlayer, lift } from "./state-components";

export function cardConstructEffect(card: CardName): SyncEffect | null {
    switch (card) {
        case "遺物":
            return gainVictoryTokens(2);
        case "機械人形":
            const gainAutomata = State.get<Player>().modify(p => ({
                ...p,
                workers: p.workers.concat({type: "automata", fetched: false})
            }));

            return {
                affect: lift(onCurrentPlayer(gainAutomata)).map(tuple => [`${tuple[0].name || tuple[0].id}の従業員に機械人形が1体追加されました`]),
                available: game => {
                    const player = getCurrentPlayer(game);
                    if (player == null) return false;
                    return maxWorkers(player) > player.workers.length;
                }
            }
        default:
            return null;
    }
}