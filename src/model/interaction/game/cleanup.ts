import { EffectLog, disposeHand } from "./sync-effect";
import State from "monad/state/state";
import { Game } from "model/protocol/game/game";
import { Player, PlayerIdentifier } from "model/protocol/game/player";
import { ExRoundPlayerStatus, ExRoundState } from "model/protocol/game/state";
import cardFactory from "factory/card";
import { wage, Board } from "model/protocol/game/board";
import { onBoard, removeFromHand } from "./state-components";

export const roundCleanup: State<Game, EffectLog> = State
    .get<Game>()
    .flatMap(game => {
        const statusAndEffect = Object.values(game.board.players).map(p => playerCleanup(p, wage(game.board.currentRound)));
        const startBoard = State.put(game.board).map<EffectLog>(_ => []);
        const effect = statusAndEffect
            .map(se => se.effect)
            .reduce((prev, current) => 
                prev.flatMap(log => current.map(ln => log.concat(...ln))), 
                startBoard);

        const state: ExRoundState = Object.values(game.board.players)
            .map((p, i) => ({[p.id]: statusAndEffect[i].status == "finish" ? "confirm" : statusAndEffect[i].status}))
            .reduce((prev, current) => ({...prev, ...current}));

        return onBoard(effect).modify(g => ({...g, state: state}));
    });


export function cleanupEndBoundary(endRound: State<Game, EffectLog>): State<Game, EffectLog> {
    return State
        .get<Game>()
        .flatMap(game => {
            const state = game.state as ExRoundState;
            const states = Object.values(game.board.players).map(p => state[p.id]);

            if (states.filter(s => s == "finish").length == states.length) {
                return endRound;
            } else {
                return State.put(game).map(_ => []);
            }
        });
}

export function isLegalSelling(game: Game, id: PlayerIdentifier, sold: number[]): boolean {
    const player = Object.values(game.board.players).find(p => p.id == id)!;
    const lack = wage(game.board.currentRound) * player.workers.filter(w => w.type != "automata").length - player.cash;
    const values = player.buildings.filter((_, i) => sold.includes(i)).map(b => cardFactory(b.card).score || 0);
    const earned = values.reduce((p, c) => p + c, 0);

    return values.filter(v => earned - v >= lack).length == 0;
}

export function resolveSelling(id: PlayerIdentifier, sold: number[]): State<Game, EffectLog> {
    return State
        .get<Game>()
        .flatMap(game => {
            const targetPlayer = Object.values(game.board.players).find(p => p.id == id)!;
            const soldBuildings = sold.map(i => targetPlayer.buildings[i].card);
            const earnings = soldBuildings.map(c => cardFactory(c).score || 0).reduce((p, c) => p + c, 0);
            
            const soldMessage = `${targetPlayer.name || targetPlayer.id}は${soldBuildings.join("、")}を売却して$${earnings}を獲得しました`;
            const playerTo: Player = {
                ...targetPlayer,
                cash: targetPlayer.cash + earnings,
                buildings: targetPlayer.buildings.filter((_, i) => !sold.includes(i))
            };
            const added = soldBuildings.map(c => ({card: c, workers: []}));
            const boardTo = playerAffected({
                ...game.board,
                soldBuildings: game.board.soldBuildings.concat(...added)
            }, playerTo);
            const board = State.put(boardTo)
                .map(_ => [soldMessage]);
            
            return onBoard(board);
        })
        .flatMap(log => State
            .get<Game>()
            .flatMap(game => {
                const targetPlayer = Object.values(game.board.players).find(p => p.id == id)!;
                const cleanup = playerCleanup(targetPlayer, wage(game.board.currentRound));
                return onBoard(cleanup.effect).modify(g => ({
                    board: g.board,
                    state: {
                        ...g.state as ExRoundState,
                        [targetPlayer.id]: cleanup.status
                    }
                }))
            })
            .map(ln => log.concat(...ln))
        );
}

export function resolveDiscarding(id: PlayerIdentifier, discarded: number[]): State<Game, EffectLog> {
    return State
        .get<Game>()
        .flatMap(game => {
            const targetPlayer = Object.values(game.board.players).find(p => p.id == id)!;
            const result = removeFromHand(discarded).run(targetPlayer);        
            const disposedBuidlings = result[0].filter(c => c != "消費財");
            const playerTo: Player = {
                ...targetPlayer,
                hand: targetPlayer.hand.filter((_, i) => !discarded.includes(i))
            };
            const boardTo: Board = {...game.board, trash: game.board.trash.concat(...disposedBuidlings)};

            const disposedConsumerGoods = result[0].length - disposedBuidlings.length;
            const message = disposedConsumerGoods ? 
                `${targetPlayer.name || targetPlayer.id}が手札から${disposedBuidlings.join("、")}${disposedBuidlings.length ? "、" : ""}消費財${disposedConsumerGoods}枚を捨てました` :
                `${targetPlayer.name || targetPlayer.id}が手札から${result[0].join("、")}を捨てました`;

            const boardEffect = State.put(playerAffected(boardTo, playerTo)).map(_ => [message]);

            const state = game.state as ExRoundState;
            const stateTo: ExRoundState = {
                ...(state.red ? state : {}),
                [id]: "finish"
            };

            return onBoard(boardEffect).modify(g => ({...g, state: stateTo}));
        });
}
        
function playerAffected(on: Board, player: Player): Board {
    const index = Object.values(on.players).findIndex(p => p.id == player.id)!;

    return {
        ...on,
        players: {
            ...on.players,
            [index]: player
        }
    };
}

function playerCleanup(player: Player, wage: number): {status: ExRoundPlayerStatus, effect: State<Board, EffectLog>} {
    const effectStart = State.get<Board>();
    const paid = player.workers.filter(w => w.type != "automata").length * wage;
    const sellableBuildings = player.buildings.filter(b => {
        const card = cardFactory(b.card);
        return !card.buildingType.includes("unsellable") && card.cost != undefined;
    });
    if (paid > player.cash && sellableBuildings.length > 0) {
        return {status: "selling", effect: effectStart.map(_ => [`${player.name || player.id}は現金が必要賃金に足りないため、建物を売却する必要があります`])};
    }

    const paidPlayer: Player = {
        ...player, 
        cash: Math.max(0, player.cash - paid),
        penalty: player.penalty + Math.max(0, paid - player.cash)
    };
    const effectPaid = effectStart
        .modify(b => ({
            ...playerAffected(b, paidPlayer),
            houseHold: b.houseHold + Math.min(player.cash, paid),
        }))
        .map(_ => 
            paid > player.cash ?
            [`${player.name || player.id}は売却できる建物がなく賃金$${paid}を支払えないため、未払い賃金$${paid - player.cash}ぶんの罰が課されます！`] :
            [`${player.name || player.id}が従業員に賃金$${paid}を支払いました`]
        );

    if (player.hand.length > 5 + 4 * player.buildings.filter(b => b.card == "倉庫").length) {
        return {status: "discarding", effect: effectPaid.map(log => log.concat(`${player.name || player.id}は手札が過剰であるため、捨てる必要があります`))};
    }

    return {status: "finish", effect: effectPaid};
}