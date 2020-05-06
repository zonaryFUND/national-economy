import { CardName } from "model/protocol/game/card";
import { Game, GameIO } from "model/protocol/game/game";
import { getCurrentPlayer } from "./util";
import cardFactory from "factory/card";
import { EffectLog } from "./sync-effect";
import State from "monad/state/state";
import { drawBuildings } from "./state-components";
import { InRoundState } from "model/protocol/game/state";
import { calcCost } from "./card";
import { Player } from "model/protocol/game/player";

export interface DisposeRequest {
    disposeCount: number;
}

export interface BuildRequest {
    costCalclator: (card: CardName, player: Player) => number | undefined;
}

export interface MultiBuildRequest {
    multiCostCalclator: (cards: CardName[], player: Player) => number | undefined;
}

export type AsyncCommandType = DisposeRequest | "free-build" | BuildRequest | MultiBuildRequest | "design-office"

export interface AsyncCommand {
    name: AsyncCommandType;
    awaitingMessage: string;
    directionMessage: string;
    available(game: Game): boolean;
    validateResponse: (resolver: AsyncResolver, game: Game) => true | string;
    stateEffect?: State<GameIO, EffectLog>;
}

export interface TargetHandCommand {
    targetHandIndices: number[];
}

export interface TargetIndexCommand {
    targetIndex: number;
}

export type AsyncResolver = TargetHandCommand | ChooseToBuildCommand | MutliBuildCommand | TargetIndexCommand;

function createCommand(name: AsyncCommandType, awaitingMessage: string, directionMessage: string, available: (game: Game) => boolean, validator: (resolver: AsyncResolver, game: Game) => true | string) {
    return {
        name: name,
        awaitingMessage: awaitingMessage,
        directionMessage: directionMessage,
        available: available,
        validateResponse: validator
    };
}

export const chooseToDispose = (amount: number, validate?: (resolver: AsyncResolver, game: Game) => (true | string)) => createCommand(
    {disposeCount: amount},
    `捨てるカードを選んでいます(${amount}枚)`,
    `手札から捨てるカードを選んでください(${amount}枚)`,
    game => {
        const player = getCurrentPlayer(game);
        return player != undefined && player.hand.length >= amount
    },
    (resolver, game) => validate ? validate(resolver, game) : true
);

export const chooseToFreeBuild = (validator: (card: CardName) => boolean) => createCommand(
    "free-build",
    "建設するカードを選んでいます",
    "手札から建設するカードを選んでください",
    game => {
        const player = getCurrentPlayer(game);
        if (player) {
            return player.hand.findIndex(c => validator(c)) > -1;
        } else {
            return false;
        }
    },
    (resolver, game) => {
        const player = getCurrentPlayer(game);
        if (player) {
            return validator(player.hand[(resolver as TargetIndexCommand).targetIndex]) ?
                true :
                "そのカードは建設できません";
        } else {
            return "謎のエラー";
        }
    }
);

export type ChooseToBuildCommand = {built: number, discard?: number[]};
export const chooseToBuild = (costCalclator: (card: CardName, player: Player) => number | undefined) => createCommand(
    {costCalclator: costCalclator},
    "建設するカードと捨てるカードを選んでいます",
    "手札から建設するカードと捨てるカードを選んでください",
    game => {
        const player = getCurrentPlayer(game);
        if (player) {
            return player.hand.findIndex(c => {
                const cost = costCalclator(c, player);
                return cost != undefined && cost <= player.hand.length - 1
            }) > -1;
        } else {
            return false;
        }
    },
    (resolver, game) => {
        const player = getCurrentPlayer(game);
        if (player == undefined) return "謎のエラー";
        const r = resolver as ChooseToBuildCommand;
        const cost = costCalclator(player.hand[r.built], player);
        if (cost == undefined) return "そのカードは建設できません";
        if (cost > player.hand.length - 1) return "建設に必要なコストを支払えません";
        return true;
    }
);

export type MutliBuildCommand = {built: number[], discard?: number[]};
export const composeBuild = createCommand(
    {multiCostCalclator: (cards, player) => calcCost(cardFactory(cards[0]), player)},
    "建設するカード(コストが同じ2枚)と捨てるカードを選んでいます",
    "手札から建設するカード(コストが同じ2枚)と捨てるカードを選んでください",
    game => {
        const player = getCurrentPlayer(game);
        if (player) {
            return player.hand.filter(c => {
                const cost = calcCost(cardFactory(c), player);
                if (cost == undefined) return false;
                if (cost > player.hand.length - 2) return false;
                return player.hand.filter(ci => calcCost(cardFactory(ci), player) == cost).length >= 2;
            }).length > 0;
        } else {
            return false;
        }
    },
    (resolver, game) => {
        const player = getCurrentPlayer(game);
        if (player == undefined) return "謎のエラー";
        const r = resolver as MutliBuildCommand;
        const cost1 = calcCost(cardFactory(player.hand[r.built[0]]), player);
        const cost2 = calcCost(cardFactory(player.hand[r.built[1]]), player);

        if (cost1 == undefined || cost2 == undefined) return "建設できないカードが含まれています";
        if (cost1 != cost2) return "建設できるのはコストが同じカード2枚です";
        return cost1 < player.hand.length - 1 ? true : "建設に必要なコストを支払えません";
    }
);

export const earthConstruction = createCommand(
    {multiCostCalclator: (cards, player) => {
        const cost0 = calcCost(cardFactory(cards[0]), player);
        const cost1 = calcCost(cardFactory(cards[1]), player);
        if (cost0 == undefined || cost1 == undefined) return undefined;
        return cost0 + cost1;
    }},
    "建設するカード2枚と捨てるカードを選んでいます",
    "手札から建設するカード2枚と捨てるカードを選んでください",
    game => {
        const player = getCurrentPlayer(game);
        if (player && player.hand.length >= 2) {
            const costs = player.hand.map(c => calcCost(cardFactory(c), player) || 99).sort((a, b) => a - b);
            return costs[0] + costs[1] <= player.hand.length - 2;
        } else {
            return false;
        }
    },
    (resolver, game) => {
        const player = getCurrentPlayer(game);
        if (player == undefined) return "謎のエラー";
        const r = resolver as MutliBuildCommand;
        const cost1 = calcCost(cardFactory(player.hand[r.built[0]]), player);
        const cost2 = calcCost(cardFactory(player.hand[r.built[1]]), player);

        if (cost1 == undefined || cost2 == undefined) return "建設できないカードが含まれています";
        return cost1 + cost2 <= player.hand.length - 2 ? true : "建設に必要なコストを支払えません";
    }
);

const revealedByDesignOffice: State<GameIO, EffectLog> = 
    drawBuildings(5)
    .flatMap(tuple => State
        .get<GameIO>()
        .modify(io => {
            const state = io.game.state as InRoundState;
            return {
                ...io,
                game: {
                    ...io.game,
                    state: {
                        ...state,
                        revealing: tuple.cards
                    }
                }
            };
        })
        .map(_ => (tuple.shuffled ? ["捨て札がシャッフルされ山札の下に補充されました"] : []))
    );  

export const designOffice = (() => {
    const command = createCommand(
        "design-office",
        "手札に入れるカードを選んでいます",
        "手札に入れるカードを選んでください",
        _ => true,
        _ => true
    );

    return {
        ...command,
        stateEffect: revealedByDesignOffice
    }
})();

 
    