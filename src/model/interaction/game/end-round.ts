import State from "monad/state/state";
import { Game } from "model/protocol/game/game";
import { EffectLog } from "./sync-effect";
import { Building } from "model/protocol/game/building";
import { Player } from "model/protocol/game/player";

function removeWorkers(buildings: Building[]): Building[] {
    return buildings.map(b => ({card: b.card, workersOwner: []}));
}

export function endRound(finish: State<Game, EffectLog>): State<Game, EffectLog> {
    const addReserved = State
        .get<Game>()
        .flatMap(game => {
            const players = Object.values(game.board.players);
            const messages = players
                .filter(p => p.reservedCards.length > 0)
                .map(p => {
                    const buildings = p.reservedCards.filter(c => c != "消費財");
                    const consumers = p.reservedCards.filter(c => c == "消費財").length;
                    return (
                        `${p.name || p.id}が取り置いていた` +
                        buildings.join("、") +
                        (buildings.length > 0 && consumers > 0 ? "、" : "") +
                        (consumers > 0 ? `消費財${consumers}枚` : "") +
                        "を手札に加えました"
                    );
                });
            const handledPlayers = players
                .map(p => ({
                    ...p,
                    hand: p.hand.concat(...p.reservedCards),
                    reservedCards: []   
                }))
                .reduce((prev, current, i) => ({...prev, [i]: current}), {});

            const to: Game = {
                ...game,
                board: {
                    ...game.board,
                    players: handledPlayers
                }
            };

            return State.put(to).map(_ => messages);
        });

    const end = State
        .get<Game>()
        .flatMap(game => {
            if (game.board.currentRound == 9) return finish;

            const players = Object.values(game.board.players);
            const start = players.find(p => p.id == game.board.startPlayer);
            const trainingDone = players
                .filter(p => p.workers.training > 0)
                .map(p => `${p.name || p.id}の新入社員${p.workers.training}人が研修を終えました`);

            const affectedPlayers = players
                .map(player => ({
                    ...player,
                    workers: {
                        available: player.workers.employed,
                        training: 0,
                        employed: player.workers.employed
                    },
                    buildings: removeWorkers(player.buildings)
                }))
                .reduce((prev, current, i) => ({...prev, [i]: current}), {});

            return State
                .put<Game>({
                    ...game,
                    board: {
                        ...game.board,
                        currentRound: game.board.currentRound + 1,
                        players: affectedPlayers,
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

    return addReserved.flatMap(log => end.map(ln => log.concat(...ln)));
}