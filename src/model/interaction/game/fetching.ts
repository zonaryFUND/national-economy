import State from "monad/state/state";
import { Game, getCurrentPlayer, GameIO } from "model/protocol/game/game";
import { EffectLog, SyncEffect } from "./sync-effect";
import { cardEffect, AsyncCardEffect } from "./card-effects";
import { onCurrentPlayer, lift } from "./state-components";
import { Player, PlayerIdentifier, WorkerType } from "model/protocol/game/player";
import { InRoundState } from "model/protocol/game/state";
import { Building } from "model/protocol/game/building";
import cardFactory from "factory/card";
import { playerAffected } from "./util";
import { CardName } from "model/protocol/game/card";

function isDoubleWorkerNeeded(card: CardName): boolean {
    switch (card) {
        case "綿花農場":
        case "炭鉱":
        case "転送装置":
            return true;
        default:
            return false;
    }
}

export function fetch(to: "occupied" | "public" | "sold", index: number, turnAround?: State<Game, EffectLog>): State<GameIO, EffectLog> {
    return lift(State.get<Game>())
        .flatMap(game => {
            const player = getCurrentPlayer(game)!;
            const targetCard = to == "public" ? game.board.publicBuildings[index].card : 
                               to == "sold" ? game.board.soldBuildings[index].card :
                               player.buildings[index].card;
            const effect = cardEffect(targetCard, to == "occupied" ? index : undefined);

            const fetchState = to == "occupied" ? onCurrentPlayer(fetchToOwned(index, isDoubleWorkerNeeded(targetCard))).map(tuple => tuple[0]) :
                               to == "sold" ? fetchToPublic("sold", index, isDoubleWorkerNeeded(targetCard)) :
                               fetchToPublic("public", index, isDoubleWorkerNeeded(targetCard));

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

function fetchToOwned(index: number, doubleWorker: boolean): State<Player, EffectLog> {
    return State
        .get<Player>()
        .flatMap(player => {
            if (doubleWorker) {
                const fetchedIndices = player.workers.reduce((p, w, i) => {
                    if (p.length == 2) return p;
                    if (!w.fetched && w.type != "training-human") return p.concat(i);
                    return p;
                }, [] as number[]);
                return State
                    .put<Player>({
                        ...player,
                        workers: player.workers.map((w, i) => fetchedIndices.includes(i) ? {...w, fetched: true} : w),
                        buildings: player.buildings.map((b, i) => {
                            if (i != index) return b;
                            return {
                                card: b.card,
                                workers: b.workers.concat(
                                    {owner: player.id, type: player.workers[fetchedIndices[0]].type}, 
                                    {owner: player.id, type: player.workers[fetchedIndices[1]].type}
                                )
                            };
                        })
                    })
                    .map(_ => [`${player.name || player.id}が所有する${player.buildings[index].card}に労働者を2人派遣しました`]);
            } else {
                const fetchedIndex = player.workers.findIndex(w => !w.fetched);
                return State
                    .put<Player>({
                        ...player,
                        workers: player.workers.map((w, i) => i != fetchedIndex ? w : {...w, fetched: true}),
                        buildings: player.buildings.map((b, i) => {
                            if (i != index) return b;
                            return {
                                card: b.card,
                                workers: b.workers.concat({owner: player.id, type: player.workers[fetchedIndex].type})
                            };
                        })
                    })
                    .map(_ => [`${player.name || player.id}が所有する${player.buildings[index].card}に労働者を${doubleWorker ? "2人" : ""}派遣しました`]);
                }
        });
}

function fetchToPublic(to: "sold" | "public", index: number, doubleWorker: boolean): State<Game, EffectLog> {
    const playerEffect = new State<Player, number[]>(player => {
        const fetchedIndices = player.workers.reduce((p, w, i) => {
            if (p.length == (doubleWorker ? 2 : 1)) return p;
            if (!w.fetched && w.type != "training-human") return p.concat(i);
            return p;
        }, [] as number[]);
        const to: Player = {
            ...player,
            workers: player.workers.map((w, i) => fetchedIndices.includes(i) ? {...w, fetched: true} : w)
        };
        return [fetchedIndices, to];
    });

    return onCurrentPlayer(playerEffect)
        .flatMap(tuple => new State<Game, EffectLog>(game => {
            const fetched = (target: Building[]) => {
                const fetchedWorkers = tuple[0].map(i => ({
                    owner: tuple[1].id,
                    type: tuple[1].workers[i].type
                }));
                return target.map((b, i) => i == index ? {card: b.card, workers: fetchedWorkers} : b)
            };
            const g: Game = {
                ...game,
                board: {
                    ...game.board,
                    soldBuildings: to == "sold" ? fetched(game.board.soldBuildings) :
                                                game.board.soldBuildings,
                    publicBuildings: to == "public" ? fetched(game.board.publicBuildings) :
                                                    game.board.publicBuildings
                }
            };
            return [[`${tuple[1].name || tuple[1].id}が公共の${(to == "public" ? game.board.publicBuildings : game.board.soldBuildings)[index].card}に労働者を${doubleWorker ? "2人" : ""}派遣しました`], g];
        })
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
            if (target.workers.length > 0 && !cardFactory(target.card, players.length).canAcceptMultiWorkers) {
                const autochthon = players.find(p => p.id == target.workers[0].owner)!;
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
    const target = (() => {
        switch (to) {
            case "mine":    return player.buildings[index].card;
            case "public":  return game.board.publicBuildings[index].card;
            case "sold":    return game.board.soldBuildings[index].card; 
        }
    })();
    const isDoubleWorker = isDoubleWorkerNeeded(target);

    const fetchingIndices = player.workers.reduce((p, w, i) => {
        if (!w.fetched) return p;
        return p.concat(i).slice(isDoubleWorker ? -2 : -1);
    }, [] as number[]);
    const workerAdjusted: Player = {
        ...player,
        workers: player.workers.map((w, i) => fetchingIndices.includes(i) ? {...w, fetched: false} : w)
    };
    const prev = playerAffected(game, workerAdjusted);

    switch (to) {
        case "mine":
            const to: Player = {
                ...workerAdjusted,
                buildings: workerAdjusted.buildings.map((b, i) => ({
                    card: b.card,
                    workers: i != index ? b.workers : b.workers.slice(0, b.workers.length - (isDoubleWorker ? 2 : 1))
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
                        workers: i != index ? b.workers : b.workers.slice(0, b.workers.length - (isDoubleWorker ? 2 : 1))
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
                        workers: i != index ? b.workers : b.workers.slice(0, b.workers.length - (isDoubleWorker ? 2 : 1))
                    }))
                }
            }
    }
}