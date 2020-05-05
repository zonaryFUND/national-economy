import { Player } from "model/protocol/game/player";
import { Game } from "model/protocol/game/game";
import { InRoundState } from "model/protocol/game/state";

export function getCurrentPlayer(game: Game): Player | undefined {
    return Object.values(game.board.players).find(p => p.id == (game.state as InRoundState).currentPlayer);
}

export function maxWorkers(player: Player): number {
    return 5 + player.buildings.filter(b => b.card == "社宅").length;
}

export function playerAffected(on: Game, to: Player): Game {
    const index = Object.values(on.board.players).findIndex(p => p.id == to.id)!;

    return {
        ...on,
        board: {
            ...on.board,
            players: {
                ...on.board.players,
                [index]: to
            }
        }
    };
}