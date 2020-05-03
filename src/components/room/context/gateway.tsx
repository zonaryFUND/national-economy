import * as React from "react";
import { GameContext } from "./game";
import Gateway from "model/interaction/game/gateway";
import { EffectLog } from "model/interaction/game/sync-effect";
import { Game } from "model/protocol/game/game";
import { AsyncResolver } from "model/interaction/game/async-command";
import { AsyncCardEffect } from "model/interaction/game/card-effects";
import { PlayerIdentifier } from "model/protocol/game/player";

export interface GatewayProviderProps {
    update: (result: [Game, EffectLog]) => void;
    error: (message: string) => void;
}

export interface GatewayProps {
    fetch: (to: "occupied" | "public" | "sold", index: number) => void;
    validate: (resolver: AsyncResolver, effect: AsyncCardEffect) => boolean;
    resolve: (resolver: AsyncResolver) => void;
    sell: (indices: number[]) => boolean;
    discard: (indices: number[]) => void;
}

function toConsumer(game: Game, provider: GatewayProviderProps, me?: PlayerIdentifier): GatewayProps {
    const fetch = (to: "occupied" | "public" | "sold", index: number) => {
        const gateway = Gateway(game);
        const fetchable = gateway.fetchable(to, index);
        if (fetchable == true) {
            provider.update(gateway.fetch(to, index));
        } else {
            provider.error(fetchable);
        }
    };

    const validate = (resolver: AsyncResolver, effect: AsyncCardEffect) => {
        const result = effect.command.validateResponse(resolver, game);
        if (result == true) return true;
        provider.error(result);
        return false;
    }

    const resolve = (resolver: AsyncResolver) => {
        const result = Gateway(game).asyncResolve(resolver);
        provider.update(result);
    }

    const sell = (indices: number[]) => {
        if (me == undefined) return false;
        const gateway = Gateway(game);
        const result = gateway.sellable(me, indices);
        if (!result) {
            provider.error("売却しなくても賃金を支払える建物が1つ以上選択されています(過剰売却制限ルール)");
            return false;
        }

        const to = gateway.cleanupSellBuilding(me, indices);
        provider.update(to);
        return true;
    };

    const discard = (indices: number[]) => {
        if (me == undefined) return;
        provider.update(Gateway(game).cleanupDiscard(me, indices));
    }

    return {
        fetch: fetch,
        validate: validate,
        resolve: resolve,
        sell: sell,
        discard: discard
    };
}

export const GatewayContext = React.createContext<GatewayProviderProps | null>(null);

export function withGateway<P extends GatewayProps, R = Omit<P, keyof(GatewayProps)>>(Component: React.ComponentType<P>): React.ComponentType<R> {
    const component: React.FC<R> = props => (
        <GameContext.Consumer>
            {gameContext => (
                <GatewayContext.Consumer>
                    {provider => <Component {...toConsumer(gameContext!.game, provider!, gameContext?.me)} {...props as any} />}
                </GatewayContext.Consumer>
            )}
        </GameContext.Consumer>
    );
    component.displayName = `withGateway(${Component.displayName})`;
    return component;
}