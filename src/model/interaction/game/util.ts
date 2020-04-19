import { Player } from "model/protocol/game/player";
import { Game } from "model/protocol/game/game";
import { InRoundState } from "model/protocol/game/state";

export function getCurrentPlayer(game: Game): Player | undefined {
    return game.board.players.find(p => p.id == (game.state as InRoundState).currentPlayer);
}

export function maxWorkers(player: Player): number {
    return 5 + player.buildings.filter(b => b.card == "社宅").length;
}