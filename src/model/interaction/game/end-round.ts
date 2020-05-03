import State from "monad/state/state";
import { Game } from "model/protocol/game/game";
import { EffectLog } from "./sync-effect";
import { Building } from "model/protocol/game/building";

function removeWorkers(buildings: Building[]): Building[] {
    return buildings.map(b => ({card: b.card, workersOwner: []}));
}

export function endRound(finish: State<Game, EffectLog>): State<Game, EffectLog> {
    return State
        .get<Game>()
        .flatMap(game => {
            if (game.board.currentRound == 9) return finish;

            const start = game.board.players.find(p => p.id == game.board.startPlayer);
            const trainingDone = game.board.players
                .filter(p => p.workers.training > 0)
                .map(p => `${p.name || p.id}の新入社員${p.workers.training}人が研修を終えました`)

            return State
                .put<Game>({
                    ...game,
                    board: {
                        ...game.board,
                        currentRound: game.board.currentRound + 1,
                        players: game.board.players.map(player => ({
                            ...player,
                            workers: {
                                available: player.workers.employed,
                                training: 0,
                                employed: player.workers.employed
                            },
                            buildings: removeWorkers(player.buildings)
                        })),
                        publicBuildings: removeWorkers(game.board.publicBuildings),
                        soldBuildings: removeWorkers(game.board.soldBuildings)
                    },
                    state: {
                        currentPlayer: game.board.startPlayer,
                        phase: "dispatching"   
                    }
                })
                .map(_ => trainingDone.concat(`ラウンド${game.board.currentRound + 1}をスタートプレイヤー${start?.name || start?.id}から開始します`));
        });
}