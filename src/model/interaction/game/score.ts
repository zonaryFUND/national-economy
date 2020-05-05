import { PlayerResult } from "model/protocol/game/state";
import { Player } from "model/protocol/game/player";
import cardFactory from "factory/card";

export function calcScore(player: Player): PlayerResult {
    const calc = {
        cash: player.cash,
        buildings: player.buildings.map(b => cardFactory(b.card).score || 0).reduce((p, c) => p + c, 0),
        victoryToken: Math.floor(player.victoryToken / 3) * 10 + (player.victoryToken % 3),
        penalty: player.penalty,
        bonus: player.buildings.map(b => {
            const bonus = cardFactory(b.card).bonusScore;
            return bonus ? bonus(player) : 0;
        }).reduce((p, c) => p + c, 0)
    };

    return {
        ...calc,
        total: calc.cash + calc.buildings + calc.victoryToken - calc.penalty * 3 + calc.bonus
    };
}