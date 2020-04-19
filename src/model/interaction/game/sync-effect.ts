import { Game } from "model/protocol/game/game";
import { InRoundState } from "model/protocol/game/state";
import { Player } from "model/protocol/game/player";
import { maxWorkers, getCurrentPlayer } from "./util";

export interface SyncEffect {
    affect(game: Game): Game;
    available(game: Game): boolean;
}

export class ConcatSyncEffect implements SyncEffect {
    readonly effects: SyncEffect[];
    constructor(effects: SyncEffect[]) {
        this.effects = effects;
    }

    affect(game: Game): Game {
        return this.effects.reduce((prev, effect) => effect.affect(prev), game);
    }

    available(game: Game): boolean {
        return this.effects.filter(effect => effect.available(game)).length == this.effects.length;
    }
}

function effectOnCurrentPlayer(game: Game, effect: (player: Player) => Player, otherwise?: (player: Player) => Player): Player[] {
    return game.board.players.map(p => {
        if (p.id != (game.state as InRoundState).currentPlayer) return otherwise ? otherwise(p) : p;
        return effect(p);
    });
}

export class DrawConsumerGoods implements SyncEffect {
    readonly amount: number;
    constructor(amount: number) {
        this.amount = amount;
    }
    
    affect(game: Game): Game {
        const players = effectOnCurrentPlayer(game, p => { return {...p, hand: p.hand.concat([...Array(this.amount)].map(_ => "消費財"))}; });
        const board = {...game.board, leftConsumerGoods: game.board.leftConsumerGoods - this.amount, players: players}
        return {...game, board: board}; 
    }

    available(game: Game): boolean {
        return game.board.leftConsumerGoods >= this.amount;
    } 
}

export class DrawBuilding implements SyncEffect {
    readonly amount: number;
    constructor(amount: number) {
        this.amount = amount;
    }
    
    affect(game: Game): Game {
        const drawn = game.board.deck.slice(0, this.amount - 1);
        const players = effectOnCurrentPlayer(game, p => { return {...p, hand: p.hand.concat(drawn)}; });
        const board = {...game.board, deck: game.board.deck.slice(this.amount), players: players}
        return {...game, board: board}; 
    }

    available(game: Game): boolean {
        return game.board.deck.length >= this.amount;
    }
}

export class Build implements SyncEffect {
    readonly target: number[];
    constructor(target: number[]) {
        this.target = target;
    }

    affect(game: Game): Game {
        const players = effectOnCurrentPlayer(game, p => {
            const built = p.hand.filter((_, i) => this.target.includes(i)).map(c => { return {card: c, workersOwner: []}; });
            const hand = p.hand.filter((_, i) => !this.target.includes(i));
            return {...p, buildings: p.buildings.concat(...built), hand: hand};
        });
        const board = {...game.board, players: players};
        return {...game, board: board};
    }

    available(game: Game): boolean {
        return true;
    }
}

export class Discard implements SyncEffect {
    readonly target: number[];
    constructor(target: number[]) {
        this.target = target;
    }

    affect(game: Game): Game {
        const players = effectOnCurrentPlayer(game, p => { return {...p, hand: p.hand.filter((_, i) => this.target.includes(i))}; });
        const board = {...game.board, players: players};
        return {...game, board: board};
    }

    available(game: Game): boolean {
        return true;
    }
}

export class Employ implements SyncEffect {
    readonly isOnCollage: boolean;
    readonly amount: number;
    constructor(isOnCollage: boolean, amount: number) {
        this.isOnCollage = isOnCollage;
        this.amount = amount;
    }

    affect(game: Game): Game {
        const players = effectOnCurrentPlayer(game, p => {
            const workers = {
                available: p.workers.available + (this.isOnCollage ? this.amount : 0), 
                training: p.workers.training + (this.isOnCollage ? 0 : this.amount),
                employed: p.workers.employed + this.amount
            };
            return {...p, workers: workers}; 
        });
        const board = {...game.board, players: players}
        return {...game, board: board}; 
    }

    available(game: Game): boolean {
        const current = getCurrentPlayer(game);
        if (current) {
            return maxWorkers(current) >= current.workers.employed + this.amount;
        } else {
            return false;
        }
    }
}

export class BecomeStartPlayer implements SyncEffect {
    affect(game: Game): Game {
        const board = {...game.board, startPlayer: getCurrentPlayer(game)!.id};
        return {...game, board: board};
    }

    available(game: Game): boolean {
        return true;
    }
}

export class DisposeBuilding implements SyncEffect {
    readonly index: number;
    constructor(index: number) {
        this.index = index;
    }

    affect(game: Game): Game {
        const players = effectOnCurrentPlayer(game, p => {
            return {...p, buildings: p.buildings.filter((_, i) => i != this.index)};
        });
        const board = {...game.board, players: players};
        return {...game, board: board};
    }

    available(game: Game): boolean {
        return true;
    }
}

export class Earn implements SyncEffect {
    readonly amount: number;
    constructor(amount: number) {
        this.amount = amount;
    }
    
    affect(game: Game): Game {
        const players = effectOnCurrentPlayer(game, p => { return {...p, cash: p.cash + this.amount}; });
        const board = {...game.board, houseHold: game.board.houseHold - this.amount, players: players}
        return {...game, board: board}; 
    }

    available(game: Game): boolean {
        return game.board.houseHold >= this.amount;
    }
}

export class LawOfficeResult implements SyncEffect {
    readonly target: number;
    constructor(target: number) {
        this.target = target;
    }

    affect(game: Game): Game {
        const drawn = game.board.deck.slice(0, 4);
        const players = effectOnCurrentPlayer(game, p => { return {...p, hand: p.hand.concat(drawn[this.target]) }; });
        const board = {...game.board, deck: game.board.deck.slice(5), players: players};
        return {...game, board: board};
    }

    available(game: Game): boolean {
        return true;
    }
}