import { Game, GameIO } from "model/protocol/game/game";
import { fetch, fetchable, cancelFetching } from "./fetching";
import { turnAround } from "./turn";
import { roundCleanup, resolveSelling, cleanupEndBoundary, resolveDiscarding, isLegalSelling } from "./cleanup";
import { lift } from "./state-components";
import { AsyncResolver } from "./async-command";
import { InRoundState, ExRoundState } from "model/protocol/game/state";
import { cardEffect, AsyncCardEffect } from "./card-effects";
import { PlayerIdentifier } from "model/protocol/game/player";
import { endRound } from "./end-round";
import { finish } from "./finish";
import { CardName } from "model/protocol/game/card";
import { SyncEffect, EffectLog } from "./sync-effect";
import { fisherYatesShuffle } from "model/shuffle";
import State from "monad/state/state";

export function randomIO(game: Game): GameIO {
    return {
        game: game,
        shuffle: fisherYatesShuffle
    };
}

const endRoundState = endRound(finish);
const cleanupBoundary = cleanupEndBoundary(endRoundState);
const cleanup = roundCleanup.flatMap(log => cleanupBoundary.map(ln => log.concat(...ln)));
const turn = turnAround(cleanup);

const Gateway = (game: Game) => {
    const io = randomIO(game);


    return {
        fetchable: (to: "occupied" | "public" | "sold", index: number) => {
            return fetchable(to, index).run(game)[0];
        },
        fetch: (to: "occupied" | "public" | "sold", index: number) => {
            const state = fetch(to, index, turn);
            const result = state.run(io);
            return [result[1].game, result[0]] as [Game, EffectLog];
        },
        asyncResolve: (resolver: AsyncResolver) => {
            const effect = cardEffect((io.game.state as InRoundState).effecting!.card) as AsyncCardEffect;
            const state = effect.resolve(resolver).flatMap(log => lift(turn).map(ln => log.concat(...ln)));
            const result = state.run(io);
            return [result[1].game, result[0]] as [Game, EffectLog];
        },
        cancelAsync: () => {
            const result = cancelFetching.run(io);
            return [result[1].game, result[0]] as [Game, EffectLog];
        },
        sellable: (id: PlayerIdentifier, sold: number[]) => {
            return isLegalSelling(game, id, sold);
        },
        cleanupSellBuilding: (id: PlayerIdentifier, sold: number[]) => {
            const state = resolveSelling(id, sold).flatMap(log => cleanupBoundary.map(ln => log.concat(ln)));
            const result = state.run(game);
            return [result[1], result[0]] as [Game, EffectLog];
        },
        cleanupDiscard: (id: PlayerIdentifier, disposed: number[]) => {
            const state = resolveDiscarding(id, disposed).flatMap(log => cleanupBoundary.map(ln => log.concat(ln)));
            const result = state.run(game);
            return [result[1], result[0]] as [Game, EffectLog];
        },
        cleanupConfirm: (id: PlayerIdentifier) => {
            const to: Game = {
                ...game,
                state: {
                    ...(game.state as ExRoundState),
                    [id]: "finish"
                }
            };
            const result = State.put(to).flatMap(_ => cleanupBoundary).run(game);
            return [result[1], result[0]] as [Game, EffectLog];
        }
    };
};

export default Gateway;
