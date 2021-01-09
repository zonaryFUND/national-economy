import State from "monad/state/state";
import { Game, getCurrentPlayer, GameIO } from "model/protocol/game/game";
import { EffectLog, SyncEffect } from "./sync-effect";
import { cardEffect, AsyncCardEffect } from "./card-effects";
import { onCurrentPlayer, lift } from "./state-components";
import { Player, PlayerIdentifier } from "model/protocol/game/player";
import { InRoundState } from "model/protocol/game/state";
import { Building } from "model/protocol/game/building";
import cardFactory from "factory/card";
import { Board } from "model/protocol/game/board";
import { playerAffected } from "./util";

export function fetch(to: "occupied" | "public" | "sold", index: number, turnAround?: State<Game, EffectLog>): State<GameIO, EffectLog> {
    return lift(State.get<Game>())
        .flatMap(game => {
            const player = getCurrentPlayer(game)!;
            const targetCard = to == "public" ? game.board.publicBuildings[index].card : 
                               to == "sold" ? game.board.soldBuildings[index].card :
                               player.buildings[index].card;
            const effect = cardEffect(targetCard, to == "occupied" ? index : undefined);

            const fetchState = to == "occupied" ? onCurrentPlayer(fetchToOwned(index)).map(tuple => tuple[0]) :
                               to == "sold" ? fetchToPublic("sold", index) :
                               fetchToPublic("public", index);

            const sync = effect as SyncEffect;
            if (sync.affect != undefined) {
                const done = lift(fetchState).flatMap(log => sync.affect.map(l => log.concat(l)));
                if (turnAround) return done.flatMap(log => lift(turnAround).map(ln => log.concat(...ln)));
                return done;
            }

            const async = effect as AsyncCardEffect;
            const setTarget = lift(fetchState)
                .modify(g => ({
                    ...g,
                    game: {
                        ...g.game,
                        state: {
                            ...(g.game.state as InRoundState),
                            phase: "oncardeffect",
                            effecting: {
                                card: targetCard,
                                address: {
                                    to: to == "occupied" ? "mine" : (to == "public" ? "public" : "sold"),
                                    index: index
                                }
                            }
                        }
                    }
                }));

            if (async.command.stateEffect != undefined) {
                return setTarget.flatMap(log => async.command.stateEffect!.map(ln => log.concat(...ln)));
            } else {
                return setTarget;
            }
        });
}

function fetchToOwned(index: number): State<Player, EffectLog> {
    return State
        .get<Player>()
        .flatMap(player => State
            .put<Player>({
                ...player,
                workers: {
                    ...player.workers,
                    available: player.workers.available - 1
                },
                buildings: player.buildings.map((b, i) => {
                    if (i != index) return b;
                    return {
                        card: b.card,
                        workersOwner: b.workersOwner.concat(player.id)
                    };
                })
            })
            .map(_ => [`${player.name || player.id}が所有する${player.buildings[index].card}に労働者を派遣しました`])
        );
}

function fetchToPublic(to: "sold" | "public", index: number): State<Game, EffectLog> {
    const playerEffect = State
        .get<Player>()
        .modify(p => ({
            ...p,
            workers: {
                ...p.workers,
                available: p.workers.available - 1
            }
        }));

    const fetched = (buildings: Building[], id: PlayerIdentifier) =>
        buildings.map((b, i) => {
            if (i != index) return b;
            return {
                card: b.card,
                workersOwner: b.workersOwner.concat(id)
            };
        });

    return onCurrentPlayer(playerEffect)
        .map(tuple => tuple[1])
        .flatMap(player => State
            .get<Game>()
            .flatMap(game => State
                .put({
                    ...game,
                    board: {
                        ...game.board,
                        soldBuildings: to == "sold" ? fetched(game.board.soldBuildings, player.id) :
                                                      game.board.soldBuildings,
                        publicBuildings: to == "public" ? fetched(game.board.publicBuildings, player.id) :
                                                          game.board.publicBuildings
                    }
                })
                .map(_ => [`${player.name || player.id}が公共の${(to == "public" ? game.board.publicBuildings : game.board.soldBuildings)[index].card}に労働者を派遣しました`])
            )
        );
}

export function fetchable(to: "occupied" | "public" | "sold", index: number): State<Game, true | string> {
    return State
        .get<Game>()
        .map(game => {
            const target = (() => {
                switch (to) {
                    case "occupied":    return getCurrentPlayer(game)!.buildings[index];
                    case "public":      return game.board.publicBuildings[index];
                    case "sold":        return game.board.soldBuildings[index];
                }
            })();

            const players = Object.values(game.board.players);
            if (target.workersOwner.length > 0 && !cardFactory(target.card, players.length).canAcceptMultiWorkers) {
                const autochthon = players.find(p => p.id == target.workersOwner[0])!;
                return `すでに${autochthon.name || autochthon.id}の労働者が働いています`;
            }
            
            const effect = cardEffect(target.card);
            const sync = effect as SyncEffect;
            if (sync.affect != undefined) return sync.available(game) ? true : "効果を発動する条件を満たしていないか、労働者を派遣できない建物です";

            const async = effect as AsyncCardEffect;
            return (async.available ?? async.command.available)(game) ? true : "効果を発動する条件を満たしていないか、労働者を派遣できない建物です";
        });
}

export const cancelFetching: State<GameIO, EffectLog> = (() => {
    const state = State
        .get<Game>()
        .flatMap(game => {
            const player = getCurrentPlayer(game);
            const address = (game.state as InRoundState).effecting!.address
            let state = game.state;
            delete (state as InRoundState).effecting;
            const to: Game = {
                ...removeEffectingWorker(game, address.to, address.index, player!),
                state: {
                    ...state as InRoundState,
                    phase: "dispatching"
                }
            }
            return State.put(to)
                .map(_ => [`${player?.name || player?.id}が派遣を取り消しました`])
        });
    return lift(state);
})();

function removeEffectingWorker(game: Game, to: "mine" | "public" | "sold", index: number, player: Player): Game {
    const workerAdjusted: Player = {
        ...player,
        workers: {
            ...player.workers,
            available: player.workers.available + 1
        }
    };
    const prev = playerAffected(game, workerAdjusted);

    switch (to) {
        case "mine":
            const to: Player = {
                ...workerAdjusted,
                buildings: workerAdjusted.buildings.map((b, i) => ({
                    card: b.card,
                    workersOwner: i != index ? b.workersOwner : b.workersOwner.slice(0, b.workersOwner.length - 2)
                }))
            };
            return playerAffected(prev, to)
        case "public":
            return {
                ...prev,
                board: {
                    ...prev.board,
                    publicBuildings: prev.board.publicBuildings.map((b, i) => ({
                        card: b.card,
                        workersOwner: i != index ? b.workersOwner : b.workersOwner.slice(0, b.workersOwner.length - 2)
                    }))
                }
            }
        case "sold":
            return {
                ...prev,
                board: {
                    ...prev.board,
                    soldBuildings: prev.board.soldBuildings.map((b, i) => ({
                        card: b.card,
                        workersOwner: i != index ? b.workersOwner : b.workersOwner.slice(0, b.workersOwner.length - 2)
                    }))
                }
            }
    }
}