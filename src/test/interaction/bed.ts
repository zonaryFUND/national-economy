import { Game, GameIO, getCurrentPlayer } from "model/protocol/game/game";
import { Player } from "model/protocol/game/player";
import { SyncEffect, EffectLog } from "model/interaction/game/sync-effect";
import { AsyncCardEffect, CardEffectType, cardEffect } from "model/interaction/game/card-effects";
import { AsyncResolver } from "model/interaction/game/async-command";
import assert = require("power-assert");
import { CardName } from "model/protocol/game/card";
import { calcScore } from "model/interaction/game/score";

export const TestPlayerRed: Player = {
    id: "red",
    hand: [],
    workers: {
        available: 2,
        training: 0,
        employed: 2
    },
    buildings: [],
    cash: 0,
    reservedCards: [],
    victoryToken: 0,
    penalty: 0
};
export const TestPlayerBlue: Player = {
    ...TestPlayerRed,
    id: "blue"
};

export const BlankBed: Game = {
    board: {
        currentRound: 1,
        deck: [],
        trash: [],
        houseHold: 0,
        players: [TestPlayerRed, TestPlayerBlue],
        startPlayer: "red",
        publicBuildings: [],
        soldBuildings: []
    },
    state: {
        currentPlayer: "red",
        phase: "dispatching"
    }
};

function pureBed(game: Game): GameIO {
    return {
        game: game,
        shuffle: array => array.reverse()
    };
}

export function available(bed: Game, card: CardEffectType) {
    if ((card as SyncEffect).affect != undefined) {
        const result = (card as SyncEffect).available(bed);
        assert.ok(result);
    } else if ((card as AsyncCardEffect).resolve != undefined) {
        const async = card as AsyncCardEffect;
        const result = (async.available || async.command.available)(bed);
        assert.ok(result);
    } else {
        assert.fail(undefined, undefined, "使用不可能なカード");
    }
}

export function unavailable(bed: Game, card: CardEffectType) {
    if ((card as SyncEffect).affect != undefined) {
        const result = (card as SyncEffect).available(bed);
        assert.ok(!result);
    } else if ((card as AsyncCardEffect).resolve != undefined) {
        const async = card as AsyncCardEffect;
        const result = (async.available || async.command.available)(bed);
        assert.ok(!result);
    } else {
        assert.ok(true);
    }
}

export function assertAffect(bed: Game, syncCard: CardEffectType, to: [EffectLog, Game]) {
    const result = (syncCard as SyncEffect).affect.run(pureBed(bed)) 
    assert.deepEqual(result[0], to[0], "ログが異なる");
    assert.deepEqual(result[1].game, to[1], "盤面変化が異なる");
}

export function asyncResolveFail(bed: Game, asyncCard: CardEffectType, resolver: AsyncResolver, message: string) {
    const result = (asyncCard as AsyncCardEffect).command.validateResponse(resolver, bed);
    assert.equal(result, message);
}

export function assertAffectIO(io: GameIO, syncCard: CardEffectType, to: [EffectLog, Game]) {
    const result = (syncCard as SyncEffect).affect.run(io);
    assert.deepEqual(result[0], to[0], "ログが異なる");
    assert.deepEqual(result[1].game, to[1], "盤面変化が異なる");
}

export function assertAffectResolve(bed: Game, asyncCard: CardEffectType, resolver: AsyncResolver, to: [EffectLog, Game]) {
    const result = (asyncCard as AsyncCardEffect).resolve(resolver).run(pureBed(bed));
    assert.deepEqual(result[0], to[0], "ログが異なる");
    assert.deepEqual(result[1].game, to[1], "盤面変化が異なる");
}

export function assertAffectIOResolve(io: GameIO, asyncCard: CardEffectType, resolver: AsyncResolver, to: [EffectLog, Game]) {
    const result = (asyncCard as AsyncCardEffect).resolve(resolver).run(io);
    assert.deepEqual(result[0], to[0], "ログが異なる");
    assert.deepEqual(result[1].game, to[1], "盤面変化が異なる");  
}

export function assertUnavailable(name: CardName) {
    assert.equal(cardEffect(name), "notforuse");
}

export function assertBonus(bed: Game, bonus: number) {
    const player = getCurrentPlayer(bed);
    if (player == undefined) {
        assert.fail();
    }

    assert.equal(calcScore(player).bonus, bonus, "ボーナススコアが異なる");
}