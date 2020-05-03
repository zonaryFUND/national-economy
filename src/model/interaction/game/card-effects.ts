import { SyncEffect, concatSyncEffect, drawBuilding, becomeStartPlayer, employ, drawConsumerGoods, disposeBuilding, earn, disposeHand, EffectLog, build } from "./sync-effect";
import { AsyncCommand, AsyncResolver, chooseToBuild, ChooseToBuildCommand, chooseToFreeBuild, TargetIndexCommand, composeBuild, ComposeBuildCommand, TargetHandCommand, chooseToDispose, designOffice } from "./async-command";
import { Game, getCurrentPlayer, GameIO } from "model/protocol/game/game";
import { CardName } from "model/protocol/game/card";
import State from "monad/state/state";
import cardFactory from "factory/card";
import { currentPlayer, drawBuildings, onBoard, onCurrentPlayer, addToHand, addToTrash, lift } from "./state-components";
import { Player } from "model/protocol/game/player";
import { InRoundState } from "model/protocol/game/state";

export interface AsyncCardEffect {
    command: AsyncCommand;
    available?: (game: Game) => boolean;
    resolve: (resolver: AsyncResolver) => State<GameIO, EffectLog>;
}

function createDisposeHandAndEarnEffect(disposed: number, earned: number): CardEffectType {
    return {
        command: chooseToDispose(disposed),
        available: game => {
            const player = getCurrentPlayer(game);
            if (player) {
                return player.hand.length >= disposed && game.board.houseHold >= earned;
            } else {
                return false;
            }
        },
        resolve: (resolver: AsyncResolver) => {
            const r = resolver as TargetHandCommand;
            return concatSyncEffect(disposeHand(r.targetHandIndices), earn(earned)).affect;
        }
    }
}

export type CardEffectType = SyncEffect | AsyncCardEffect | "notforuse";

export function cardEffect(card: CardName, indexOnHand?: number): CardEffectType {
    switch (card) {
        // 即時
        case "採石場":
            return concatSyncEffect(drawBuilding(1), becomeStartPlayer());
        case "鉱山":
            return drawBuilding(1);
        case "学校":
            return employ(false);
        case "高等学校":
            return {
                affect: lift(currentPlayer()).flatMap(p => employ(false, 4 - p.workers.employed).affect),
                available: game => {
                    const player = getCurrentPlayer(game);
                    return player != undefined && player.workers.employed < 4;
                }
            }
        case "大学":
            return {
                affect: lift(currentPlayer()).flatMap(p => employ(false, 5 - p.workers.employed).affect),
                available: game => {
                    const player = getCurrentPlayer(game);
                    return player != undefined && player.workers.employed < 5;
                }
            }
        case "専門学校":
            return employ(true);
        case "農場":
            return drawConsumerGoods(2);
        case "焼畑":
            return concatSyncEffect(drawConsumerGoods(5), disposeBuilding(indexOnHand || 0));
        case "珈琲店":
            return earn(5);
        case "果樹園":
            return {
                affect: lift(currentPlayer()).flatMap(p => drawConsumerGoods(4 - p.hand.length).affect),
                available: game => {
                    const player = getCurrentPlayer(game);
                    return player != undefined && player.hand.length < 4;
                }
            };
        case "大農園":
            return drawConsumerGoods(3);
        case "製鉄所":
            return drawBuilding(3);
        case "化学工場":
            return {
                affect: lift(currentPlayer()).flatMap(p => drawBuilding(p.hand.length == 0 ? 4 : 2).affect),
                available: _ => true
            }
        
        // 選択肢あり
        // 建設系
        case "大工":
            return {
                command: chooseToBuild(c => cardFactory(c).cost),
                resolve: (resolver: AsyncResolver) => {
                    const r = resolver as ChooseToBuildCommand;
                    const discard = r.discard!.map(i => i > r.built ? i - 1 : i);
                    return concatSyncEffect(build([r.built]), disposeHand(discard)).affect;
                }
            };
        case "建設会社":
            return {
                command: chooseToBuild(c => {
                    const cost = cardFactory(c).cost;
                    return cost == undefined ? undefined : cost - 1;
                }),
                resolve: (resolver: AsyncResolver) => {
                    const r = resolver as ChooseToBuildCommand;
                    const discard = r.discard!.map(i => i > r.built ? i - 1 : i);
                    return concatSyncEffect(build([r.built]), disposeHand(discard)).affect;
                }
            }
        case "開拓民":
            return {
                command: chooseToFreeBuild(c => cardFactory(c).buildingType.includes("agricultural")),
                resolve: (resolver: AsyncResolver) => {
                    const r = resolver as TargetIndexCommand;
                    return build([r.targetIndex]).affect;   
                }
            }
        case "ゼネコン":
            return {
                command: chooseToBuild(card => cardFactory(card).cost),
                resolve: (resolver: AsyncResolver) => {
                    const r = resolver as ChooseToBuildCommand;
                    const discard = r.discard!.map(i => i > r.built ? i - 1 : i);
                    return concatSyncEffect(build([r.built]), disposeHand(discard), drawBuilding(2)).affect;
                }
            }
        case "二胡市建設":
            return {
                command: composeBuild,
                resolve: (resolver: AsyncResolver) => {
                    const r = resolver as ComposeBuildCommand;
                    const discard = r.discard!.map(i => i - r.built.filter(b => b < i).length);
                    return concatSyncEffect(build(r.built), disposeHand(discard)).affect;
                }
            }

        // 捨て札系
        case "露店":
            return createDisposeHandAndEarnEffect(1, 6);
        case "市場":
            return createDisposeHandAndEarnEffect(2, 12);
        case "スーパーマーケット":
            return createDisposeHandAndEarnEffect(3, 18);
        case "百貨店":
            return createDisposeHandAndEarnEffect(4, 24);
        case "万博":
            return createDisposeHandAndEarnEffect(5, 30);
        case "工場": {
            return {
                command: chooseToDispose(2),
                resolve: (resolver: AsyncResolver) => {
                    const r = resolver as TargetHandCommand;
                    return concatSyncEffect(disposeHand(r.targetHandIndices), drawBuilding(4)).affect;
                }
            }
        }
        case "レストラン":
            return createDisposeHandAndEarnEffect(1, 15);
        case "自動車工場": {
            return {
                command: chooseToDispose(3),
                resolve: (resolver: AsyncResolver) => {
                    const r = resolver as TargetHandCommand;
                    return concatSyncEffect(disposeHand(r.targetHandIndices), drawBuilding(7)).affect;
                }
            }
        }
    
        // 特殊
        case "設計事務所":
            return {
                command: designOffice,
                resolve: (resolver: AsyncResolver) => {
                    const r = resolver as TargetIndexCommand;
                    const effect = State
                        .get<Game>()
                        .flatMap(game => {
                            const revealed = (game.state as InRoundState).revealing!;
                            const drawn = revealed[r.targetIndex];
                            const trashed = revealed.filter((c, i) => c != "消費財" && i != r.targetIndex);

                            const addHandEffect = onCurrentPlayer(addToHand([drawn]));
                            const trashEffect = onBoard(addToTrash(trashed));
                            const player = getCurrentPlayer(game)!;
                            const mainMessage =  
                                `${player.name || player.id}が山札の上から` + 
                                `${revealed.join("、")}` + 
                                (revealed.length > 0 && revealed.length < 5 ? "、" : "") +
                                (revealed.length < 5 ? `消費財${5 - revealed.length}枚` : "") +
                                "をめくり、" + 
                                `${drawn}を手札に加えて残りを捨て札にしました`;
                            return trashEffect.flatMap(_ => addHandEffect)
                                .map(_ => [mainMessage]);
                        });
                    return lift(effect);
                }
            }

        // 使用不可
        case "倉庫":
        case "法律事務所":
        case "不動産屋":
        case "農協":
        case "労働組合":
        case "本社ビル":
        case "社宅":
        case "邸宅":
        case "消費財":
            return "notforuse";

        default:
            return "notforuse";
    }
}