import State from "monad/state/state";
import { Game } from "model/protocol/game/game";
import { EffectLog } from "./sync-effect";
import { InRoundState } from "model/protocol/game/state";

export function turnAround(cleanup: State<Game, EffectLog>): State<Game, EffectLog> {
    return State
        .get<Game>()
        .flatMap(game => {
            const players = Object.values(game.board.players);
            const availables = players.map(p => p.workers.available);
            if (availables.filter(w => w > 0).length == 0) {
                return State
                    .put(game)
                    .flatMap(_ => 
                        cleanup.map(ln => [`ラウンド${game.board.currentRound}が終了しました`].concat(...ln))
                    );
            }

            const currentIndex = players.findIndex(p => p.id == (game.state as InRoundState).currentPlayer);
            const nextIndex = (currentIndex + 1) % players.length; 
            const next = players.slice(nextIndex).concat(players.slice(0, nextIndex))
                .filter(p => p.workers.available > 0)
                [0].id;

            const stateTo: InRoundState = {
                currentPlayer: next,
                phase: "dispatching"
            };
            return State
                .put<Game>({board: game.board, state: stateTo})
                .map(_ => []);
        });
}