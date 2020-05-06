import State from "monad/state/state";
import { Game } from "model/protocol/game/game";
import { EffectLog } from "./sync-effect";
import { calcScore, victoryTokenScore } from "./score";

export const finish: State<Game, EffectLog> = State
    .get<Game>()
    .flatMap(game => {
        const players = Object.values(game.board.players);
        const score = players.map(calcScore)
        const max = Math.max(...score.map(s => s.total));
        const startPlayerIndex = players.findIndex(p => p.id == game.board.startPlayer);

        const scoredPlayers = players.map((p, i) => {
            const startDiff = i - startPlayerIndex;
            return {player: p, score: score[i], tieBreaker: startDiff >= 0 ? startDiff : (startDiff + 4)};
        }).filter(e => e.score.total == max);
        const winner = scoredPlayers.reduce((e, current) => e.tieBreaker < current.tieBreaker ? e : current, scoredPlayers[0]);

        return State
            .put<Game>({
                ...game,
                state: {winner: winner.player.name || winner.player.id}
            })
            .map(_ => {
                const scoreLog = players.map((p, i) => `${p.name || p.id}は${score[i].total}点を獲得しました`);
                return scoreLog
                    .concat(`${winner.player.name || winner.player.id}が${winner.score.total}点で勝利！${scoredPlayers.length > 1 ? "(タイブレーク)" : ""}`);
            });
    });
