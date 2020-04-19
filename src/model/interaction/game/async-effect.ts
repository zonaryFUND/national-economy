import { SyncEffect, Discard, ConcatSyncEffect, Build, LawOfficeResult } from "./sync-effect";
import { CardName } from "model/protocol/game/card";
import { Game } from "model/protocol/game/game";
import { getCurrentPlayer } from "./util";
import cardFactory from "factory/card";

export interface AsyncEffect {
    awaitingMessage: string;
    directionMessage: string;
    effect: Promise<SyncEffect>;
    available(game: Game): boolean;
}

export class ChooseToDispose implements AsyncEffect {
    readonly amount: number;
    private acceptor: ((cards: number[]) => void) | null;
    readonly effect: Promise<SyncEffect>;
    constructor(amount: number) {
        this.amount = amount;
        this.acceptor = null;
        this.effect = new Promise<number[]>(resolve => this.acceptor = resolve).then(target => new Discard(target));
    }

    readonly awaitingMessage = `捨てるカードを選んでいます(${this.amount}枚)`;
    readonly directionMessage = `捨てるカードを選んでください(${this.amount}枚)`;

    confirm(cards: number[]) {
        if (this.acceptor) this.acceptor(cards);
    }

    available(game: Game): boolean {
        const player = getCurrentPlayer(game);
        return player != undefined && player.hand.length >= this.amount;
    }
}

type ChooseToBuildCommand = {built: number, discard: number[]};
export class ChooseToBuild implements AsyncEffect {
    readonly costCalclator: (card: CardName) => number;
    private acceptor: ((command: ChooseToBuildCommand) => void) | null;
    readonly effect: Promise<SyncEffect>;
    constructor(costCalclator: (card: CardName) => number) {
        this.costCalclator = costCalclator;
        this.acceptor = null;
        this.effect = new Promise<ChooseToBuildCommand>(resolve => this.acceptor = resolve)
            .then(tuple => {
                const adjustedDiscard = tuple.discard.map(i => i > tuple.built ? i - 1 : i);
                return new ConcatSyncEffect([new Build([tuple.built]), new Discard(adjustedDiscard)]);
            });
    }

    readonly awaitingMessage = "建設するカードと捨てるカードを選んでいます";
    readonly directionMessage = "建設するカードと捨てるカードを選んでください";

    confirm(command: ChooseToBuildCommand) {
        if (this.acceptor) this.acceptor(command);
    }

    available(game: Game): boolean {
        const player = getCurrentPlayer(game);
        if (player) {
            return player.hand.findIndex(c => this.costCalclator(c) <= player.hand.length - 1) > -1;
        } else {
            return false;
        }
    }
}

type ComposeBuildCommand = {built: number[], discard: number[]};
export class ComposeBuild implements AsyncEffect {
    private acceptor: ((command: ComposeBuildCommand) => void) | null;
    readonly effect: Promise<SyncEffect>;
    constructor() {
        this.acceptor = null;
        this.effect = new Promise<ComposeBuildCommand>(resolve => this.acceptor = resolve)
            .then(tuple => {
                const adjustedDiscard = tuple.discard.map(i => i - tuple.discard.filter(d => d < i).length);
                return new ConcatSyncEffect([new Build(tuple.built), new Discard(adjustedDiscard)]);
            });
    }

    readonly awaitingMessage = "建設するカード(コストが同じ2枚)と捨てるカードを選んでいます";
    readonly directionMessage = "建設するカード(コストが同じ2枚)と捨てるカードを選んでください";

    confirm(command: ComposeBuildCommand) {
        if (this.acceptor) this.acceptor(command);
    }

    available(game: Game): boolean {
        const player = getCurrentPlayer(game);
        if (player) {
            return player.hand.filter(c => {
                const cost = cardFactory(c).cost;
                if (cost == undefined) return false;
                if (cost > player.hand.length - 2) return false;
                return player.hand.filter(ci => cardFactory(ci).cost == cost).length >= 2;
            }).length > 0;
        } else {
            return false;
        }
    }
}

export class LawOfficeChoose implements AsyncEffect {
    private acceptor: ((target: number) => void) | null;
    readonly effect: Promise<SyncEffect>;
    constructor() {
        this.acceptor = null;
        this.effect = new Promise<number>(resolve => this.acceptor = resolve)
            .then(target => new LawOfficeResult(target));
    }

    readonly awaitingMessage = "手札に入れるカードを選んでいます";
    readonly directionMessage = "手札に入れるカードを選んでください";

    optionCards(game: Game): CardName[] {
        return game.board.deck.slice(0, 4);
    }

    confirm(target: number) {
        if (this.acceptor) this.acceptor(target);
    }

    available(game: Game): boolean {
        return game.board.deck.length >= 5;
    }
}