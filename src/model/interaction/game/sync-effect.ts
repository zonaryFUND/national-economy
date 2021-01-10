import { Game, GameIO } from "model/protocol/game/game";
import { Player, Worker } from "model/protocol/game/player";
import { maxWorkers, getCurrentPlayer } from "./util";
import { Board } from "model/protocol/game/board";
import State from "monad/state/state";
import { CardName } from "model/protocol/game/card";
import { onBoard, onCurrentPlayer, currentPlayer, removeFromHand, handToBuildings, addToTrash, addToHand, drawBuildings, lift, gainVictoryToken, reserve } from "./state-components";
import { cardConstructEffect } from "./card-construct-effects";

export type EffectLog = string[];

export interface SyncEffect {
    affect: State<GameIO, EffectLog>;
    available(game: Game): boolean;
}

export function concatSyncEffect(...effects: SyncEffect[]): SyncEffect {
    return {
        affect: effects
            .map(e => e.affect)
            .reduce((prev, affect) => prev.flatMap(logPrev => affect.map(a => logPrev.concat(a)))),
        available: game => effects.filter(effect => effect.available(game)).length == effects.length
    };
}

export function drawConsumerGoods(amount: number): SyncEffect {
    const affect = onCurrentPlayer(addToHand([...Array(amount)].map(_ => "消費財")))
                .map(tuple => [`${tuple[1].name || tuple[1].id}が消費財を${amount}枚引きました`])

    return {
        affect: lift(affect),
        available: _ => true
    };
}

export function drawBuilding(amount: number): SyncEffect {
    const affect = State
        .get<GameIO>()
        .flatMap(io => {
            const available = Math.min(io.game.board.deck.length + io.game.board.trash.length, amount);
            const drawConsumer = available < amount;
            const drawState = drawBuildings(available).flatMap(t => lift(onCurrentPlayer(addToHand(t.cards))).map(_ => t));
            const state = drawConsumer ?
                drawState.flatMap(t => drawConsumerGoods(amount - available).affect.map(_ => t)) :
                drawState;


            const current = getCurrentPlayer(io.game)!;
            const drawMessage = `${current.name || current.id}が` +
                (available > 0 ? `カードを${available}枚` : "") +
                (available > 0 && drawConsumer ? "、" : "") +
                (drawConsumer ? `消費財を${amount - available}枚` : "") +
                "引きました" +
                (drawConsumer ? "(山札、捨て札切れ)" : "");

            return state.map(tuple => 
                tuple.shuffled ? ["捨て札がシャッフルされ山札の下に補充されました"].concat(drawMessage) :
                [drawMessage]
            );
        });
            
    return {
        affect: affect,
        available: _ => true
    };
}

export function disposeHand(targetHandIndices: number[]): SyncEffect {
    if (targetHandIndices.length == 0) return {affect: State.returnS([]), available: _ => true};

    const affect = onCurrentPlayer(removeFromHand(targetHandIndices))
                .flatMap(tuple => {
                    const disposedBuidlings = tuple[0].filter(c => c != "消費財");
                    const disposedConsumerGoods = tuple[0].length - disposedBuidlings.length;
                    const message = disposedConsumerGoods ? 
                        `${tuple[1].name || tuple[1].id}が手札から${disposedBuidlings.join("、")}${disposedBuidlings.length ? "、" : ""}消費財${disposedConsumerGoods}枚を捨てました` :
                        `${tuple[1].name || tuple[1].id}が手札から${tuple[0].join("、")}を捨てました`;

                    return onBoard(addToTrash(disposedBuidlings)).map(_ => [message]);
                });

    return {
        affect: lift(affect),
        available: _ => true
    };
}

export function disposeConsumerGoods(amount: number): SyncEffect {
    function removeConsumerGoods(hand: CardName[], amount: number): CardName[] {
        if (amount == 0) return hand;
        const index = hand.findIndex(c => c == "消費財");
        const removed = hand.filter((_, i) => i != index);
        return removeConsumerGoods(removed, amount - 1);
    }

    const playerEffect = State
        .get<Player>()
        .modify(p => ({
            ...p,
            hand: removeConsumerGoods(p.hand, amount)
        }));
    const eff = onCurrentPlayer(playerEffect)
        .map(t => [`${t[0].name || t[0].id}が手札から消費財${amount}枚を捨てました`]);
        
    return {
        affect: lift(eff),
        available: game => getCurrentPlayer(game)!.hand.filter(c => c == "消費財").length >= amount
    };
}

export function build(targetHandIndices: number[]): SyncEffect {
    const affect = lift(onCurrentPlayer(handToBuildings(targetHandIndices)))
                .flatMap(tuple => {
                    const buildLog = State.returnS<GameIO, EffectLog>([`${tuple[1].name || tuple[1].id}が${tuple[0].join("と")}を建設しました`]);
                    return tuple[0].reduce((prev, card) => {
                        const effect = cardConstructEffect(card);
                        if (effect) return prev.flatMap(log => effect.affect.map(l => log.concat(l)));
                        return prev;
                    }, buildLog);
                });
    

    return {
        affect: affect,
        available: _ => true
    };
}

export function employ(workReady: boolean, amount?: number): SyncEffect {
    const newComers = [...Array(amount)].map(_ => ({type: workReady ? "human" : "training-human", fetched: false} as Worker));
    const playerEffect = State.get<Player>()
                    .modify(p => ({...p, workers: p.workers.concat(newComers)}));
    const affect = onCurrentPlayer(playerEffect)
                .map(tuple => [`${tuple[1].name || tuple[1].id}が労働者${amount || 1}人を${workReady ? "即戦力として" : "研修中として"}雇用しました`]);

    return {
        affect: lift(affect),
        available: game => {
            const current = getCurrentPlayer(game);
            if (!current) return false;
            return maxWorkers(current) > current.workers.length;
        }
    };
}

export function becomeStartPlayer(): SyncEffect {
    const affect = currentPlayer()
                .flatMap(p => 
                    onBoard(
                        State.get<Board>()
                        .modify(b => ({...b, startPlayer: p.id}))
                        .map(_ => [`${p.name || p.id}が次ラウンドのスタートプレイヤーになりました`])
                    )
                );
        
    return {
        affect: lift(affect),
        available: _ => true
    };
}

export function disposeBuilding(targetIndex: number): SyncEffect {
    const affect = onCurrentPlayer(
                    State.get<Player>()
                    .map(p => p.buildings[targetIndex].card)
                    .modify(p => ({...p, buildings: p.buildings.filter((_, i) => i != targetIndex)}))
                )
                .flatMap(tuple => onBoard(addToTrash([tuple[0]]).map(_ => tuple)))
                .map(tuple => [`${tuple[1].name || tuple[1].id}の私有建造物であった${tuple[0]}が捨て札になりました`]);

    return {
        affect: lift(affect),
        available: _ => true
    };
}

export function earn(amount: number): SyncEffect {
    const playerEffect = State.get<Player>()
                    .modify(p => ({...p, cash: p.cash + amount}));
    const boardEffect = State.get<Board>()
                    .modify(b => ({...b, houseHold: b.houseHold - amount}));
    const affect = onBoard(boardEffect)
                    .flatMap(_ => onCurrentPlayer(playerEffect))
                    .map(tuple => [`${tuple[1].name || tuple[1].id}が家計から$${amount}を獲得しました`]);

    return {
        affect: lift(affect),
        available: g => g.board.houseHold >= amount
    };
}

export function returnToHousehold(amount: number): SyncEffect {
    const playerEffect = State.get<Player>()
                    .modify(p => ({...p, cash: p.cash - amount}));
    const boardEffect = State.get<Board>()
                    .modify(b => ({...b, houseHold: b.houseHold + amount}));
    const affect = onBoard(boardEffect)
                    .flatMap(_ => onCurrentPlayer(playerEffect))
                    .map(tuple => [`${tuple[1].name || tuple[1].id}が家計に$${amount}を返しました`]);

    return {
        affect: lift(affect),
        available: _ => true
    };
}

export function lawOfficeResult(target: number): SyncEffect {
    const message = (player: Player, topFiveCards: CardName[]) => 
        `${player.name || player.id}が山札の上から5枚を見て1枚を手札に加え、残りの${topFiveCards.filter((_, i) => i != target).join("、")}を捨てました`;

    const affect = drawBuildings(5)
                .flatMap(result => 
                    lift(onCurrentPlayer(addToHand([result.cards[target]])))
                    .map(tuple => result.shuffled ?
                        ["捨て札がシャッフルされ山札の下に補充されました", message(tuple[1], result.cards)] :
                        [message(tuple[1], result.cards)])
                );

    return {
        affect: affect,
        available: _ => true
    };
}

export function gainVictoryTokens(amount: number): SyncEffect {
    return {
        affect: lift(onCurrentPlayer(gainVictoryToken(amount))).map(p => [`${p[0].name || p[0].id}が勝利点トークンを${amount}つ獲得しました`]),
        available: _ => true
    };
}

export function reserveCards(cards: CardName[]): SyncEffect {
    return {
        affect: lift(onCurrentPlayer(reserve(cards))).map(tuple => {
            const buildings = cards.filter(c => c != "消費財");
            const consumers = cards.filter(c => c == "消費財").length;
            const cardMessage = buildings.join("、") +
                                (buildings.length > 0 && consumers > 0 ? "、" : "") +
                                (consumers > 0 ? `消費財${consumers}枚` : "")
            return [`${tuple[1].name || tuple[1].id}が${cardMessage}を取り置きました`];
        }),
        available: _ => true
    }
}
