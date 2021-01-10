import { SyncEffect, concatSyncEffect, drawBuilding, becomeStartPlayer, employ, drawConsumerGoods, disposeBuilding, earn, disposeHand, EffectLog, build, gainVictoryTokens, returnToHousehold, reserveCards, disposeConsumerGoods } from "./sync-effect";
import { AsyncCommand, AsyncResolver, chooseToBuild, ChooseToBuildCommand, chooseToFreeBuild, TargetIndexCommand, composeBuild, MutliBuildCommand, TargetHandCommand, chooseToDispose, designOffice, earthConstruction, MultiBuildRequest, rural, OptionSelectionCommand, modanism } from "./async-command";
import { Game, getCurrentPlayer, GameIO } from "model/protocol/game/game";
import { CardName } from "model/protocol/game/card";
import State from "monad/state/state";
import cardFactory from "factory/card";
import { currentPlayer, drawBuildings, onBoard, onCurrentPlayer, addToHand, addToTrash, lift, gainVictoryToken } from "./state-components";
import { Player } from "model/protocol/game/player";
import { InRoundState } from "model/protocol/game/state";
import { calcCost } from "./card";

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

function createDisposeAndDrawEffect(disposed: number, drawn: number): CardEffectType {
    return {
        command: chooseToDispose(disposed),
        resolve: (resolver: AsyncResolver) => {
            const r = resolver as TargetHandCommand;
            return concatSyncEffect(disposeHand(r.targetHandIndices), drawBuilding(drawn)).affect;
        }
    };
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
                affect: lift(currentPlayer()).flatMap(p => employ(false, 4 - p.workers.length).affect),
                available: game => {
                    const player = getCurrentPlayer(game);
                    return player != undefined && player.workers.length < 4;
                }
            }
        case "大学":
            return {
                affect: lift(currentPlayer()).flatMap(p => employ(false, 5 - p.workers.length).affect),
                available: game => {
                    const player = getCurrentPlayer(game);
                    return player != undefined && player.workers.length < 5;
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


        // Mecenat
        case "菜園":
            return concatSyncEffect(drawConsumerGoods(2), gainVictoryTokens(1));
        case "鉄工所":
            return {
                affect: drawBuilding(2).affect,
                available: game => {
                    const current = getCurrentPlayer(game);
                    return current?.id != undefined && 
                        game.board.publicBuildings.find(b => b.card == "鉱山" && b.workers.findIndex(w => w.owner == current.id) != -1) != undefined;
                }
            }
        case "宝くじ":
            return concatSyncEffect(earn(20), returnToHousehold(10));
        case "芋畑":
            return {
                affect: lift(currentPlayer()).flatMap(p => drawConsumerGoods(3 - p.hand.length).affect),
                available: game => {
                    const player = getCurrentPlayer(game);
                    return player != undefined && player.hand.length < 3;
                }
            };
        case "観光牧場":
            return {
                affect: lift(currentPlayer()).flatMap(p => earn(p.hand.filter(h => h == "消費財").length * 4).affect),
                available: game => {
                    const player = getCurrentPlayer(game);
                    if (player == undefined) return false;
                    const consumergoods = player.hand.filter(h => h == "消費財").length;
                    return consumergoods > 0 && game.board.houseHold >= consumergoods * 4;
                }
            };
        case "研究所":
            return concatSyncEffect(drawBuilding(2), gainVictoryTokens(1));
        case "醸造所":  
            return reserveCards(["消費財", "消費財", "消費財", "消費財"]);
        case "石油コンビナート":
            return drawBuilding(4);
        case "工業団地":
            return drawBuilding(3);
        case "養殖場":
            return {
                affect: lift(currentPlayer()).flatMap(p => {
                    const drawn = p.hand.findIndex(c => c == "消費財") >= 0 ? 3 : 2;
                    return drawConsumerGoods(drawn).affect;
                }),
                available: _ => true
            };

        // Glory
        case "遺跡":
            return concatSyncEffect(drawConsumerGoods(1), gainVictoryTokens(1));
        case "工房":
            return concatSyncEffect(drawBuilding(1), gainVictoryTokens(1));
        case "養鶏場":
            return {
                affect: lift(currentPlayer()).flatMap(p => {
                    const drawn = p.hand.length % 2 ? 3 : 2;
                    return drawConsumerGoods(drawn).affect
                }),
                available: _ => true
            };
        case "ゲームカフェ":
            return {
                affect: lift(currentPlayer()).flatMap(p => {
                    const amount = p.workers.filter(w => !w.fetched && w.type != "training-human").length == 0 ? 10 : 5;
                    return earn(amount).affect
                }),
                available: game => {
                    const p = getCurrentPlayer(game);
                    if (p == null) return false;
                    const amount = p.workers.filter(w => !w.fetched && w.type != "training-human").length == 0 ? 10 : 5;
                    return game.board.houseHold >= amount;
                }
            };
        case "綿花農場":
            return {
                affect: drawConsumerGoods(5).affect,
                available: game => {
                    const p = getCurrentPlayer(game);
                    if (p == null) return false;
                    return p.workers.filter(w => !w.fetched && w.type != "training-human").length >= 2;
                }
            };
        case "美術館":
            return {
                affect: lift(currentPlayer()).flatMap(p => {
                    const amount = p.hand.length == 5 ? 14 : 7;
                    return earn(amount).affect
                }),
                available: game => {
                    const p = getCurrentPlayer(game);
                    if (p == null) return false;
                    const amount = p.hand.length == 5 ? 14 : 7;
                    return game.board.houseHold >= amount;
                }
            };
        case "炭鉱":
            return {
                affect: drawBuilding(5).affect,
                available: game => {
                    const p = getCurrentPlayer(game);
                    if (p == null) return false;
                    return p.workers.filter(w => !w.fetched && w.type != "training-human").length >= 2; 
                }
            };
        case "精錬所":
            return drawBuilding(3);
        case "温室":
            return drawConsumerGoods(4);
        

        // 選択肢あり
        // 建設系
        case "大工":
            return {
                command: chooseToBuild((c, p) => calcCost(cardFactory(c), p)),
                resolve: (resolver: AsyncResolver) => {
                    const r = resolver as ChooseToBuildCommand;
                    const discard = r.discard!.map(i => i > r.built ? i - 1 : i);
                    return concatSyncEffect(build([r.built]), disposeHand(discard)).affect;
                }
            };
        case "建設会社":
            return {
                command: chooseToBuild((c, p) => {
                    const cost = calcCost(cardFactory(c), p);
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
                command: chooseToBuild((card, p) => calcCost(cardFactory(card), p)),
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
                    const r = resolver as MutliBuildCommand;
                    const discard = r.discard!.map(i => i - r.built.filter(b => b < i).length);
                    return concatSyncEffect(build(r.built), disposeHand(discard)).affect;
                }
            }

        // Mecenat
        case "建築会社":
            const costCalculator = (card: CardName, player: Player) => {
                const c = cardFactory(card);
                if (!c.buildingType.includes("unsellable")) return undefined;
                return calcCost(c, player);
            };
            return {
                command: chooseToBuild(costCalculator),
                resolve: (resolver: AsyncResolver) => {
                    const r = resolver as ChooseToBuildCommand;
                    const discard = r.discard!.map(i => i > r.built ? i - 1 : i);
                    return concatSyncEffect(build([r.built]), disposeHand(discard), drawBuilding(2)).affect;
                }
            };
        case "地球建設":
            return {
                command: earthConstruction,
                resolve: (resolver: AsyncResolver) => {
                    const r = resolver as MutliBuildCommand;
                    const discard = r.discard!.map(i => i - r.built.filter(b => b < i).length);
                    const buildEffect = concatSyncEffect(build(r.built), disposeHand(discard)).affect;

                    return buildEffect.flatMap(log => 
                        lift(currentPlayer())
                            .flatMap(p => {
                                if (p.hand.length > 0) return State.get<GameIO>().map(_ => log);
                                return drawBuilding(3).affect.map(ln => log.concat(...ln));
                            })
                    );
                }
            }
        case "宮大工":
            return {
                command: chooseToBuild((c, p) => calcCost(cardFactory(c), p)),
                resolve: (resolver: AsyncResolver) => {
                    const r = resolver as ChooseToBuildCommand;
                    const discard = r.discard!.map(i => i > r.built ? i - 1 : i);
                    return concatSyncEffect(build([r.built]), disposeHand(discard), gainVictoryTokens(1)).affect;
                }
            };
        case "プレハブ工務店":
            return {
                command: chooseToFreeBuild(c => (cardFactory(c).score || 99) <= 10),
                resolve: (resolver: AsyncResolver) => {
                    const r = resolver as TargetIndexCommand;
                    return build([r.targetIndex]).affect;   
                }
            }

        // Glory
        case "植民団":
            return {
                command: chooseToBuild((card, p) => calcCost(cardFactory(card), p)),
                resolve: (resolver: AsyncResolver) => {
                    const r = resolver as ChooseToBuildCommand;
                    const discard = r.discard!.map(i => i > r.built ? i - 1 : i);
                    return concatSyncEffect(build([r.built]), disposeHand(discard), drawConsumerGoods(1)).affect;
                }
            };
        case "摩天建設":
            return {
                command: chooseToBuild((card, p) => calcCost(cardFactory(card), p)),
                resolve: (resolver: AsyncResolver) => {
                    const r = resolver as ChooseToBuildCommand;
                    const discard = r.discard!.map(i => i > r.built ? i - 1 : i);
                    const buildEffect = concatSyncEffect(build([r.built]), disposeHand(discard)).affect;

                    return buildEffect.flatMap(log => 
                        lift(currentPlayer())
                            .flatMap(p => {
                                if (p.hand.length > 0) return State.returnS(log);
                                return drawBuilding(2).affect.map(ln => log.concat(...ln));
                            })
                        );
                }
            }
        case "モダニズム建設":
            return {
                command: modanism,
                resolve: (resolver: AsyncResolver) => {
                    const r = resolver as ChooseToBuildCommand;
                    const discard = r.discard!.map(i => i > r.built ? i - 1 : i);
                    return concatSyncEffect(build([r.built]), disposeHand(discard)).affect;
                }
            };
        case "転送装置":
            const freeBuildCommand = chooseToFreeBuild(_ => true);
            const workerConditionAdded = {
                ...freeBuildCommand,
                available: (game: Game) => {
                    if (freeBuildCommand.available(game) == false) return false;
                    const player = getCurrentPlayer(game);
                    if (player) return player.workers.filter(w => !w.fetched && w.type != "training-human").length >= 2;
                    return false;
                }
            };
            return {
                command: workerConditionAdded,
                resolve: (resolver: AsyncResolver) => {
                    const r = resolver as TargetIndexCommand;
                    return build([r.targetIndex]).affect;
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
        case "工場": 
            return createDisposeAndDrawEffect(2, 4);
        case "レストラン":
            return createDisposeHandAndEarnEffect(1, 15);
        case "自動車工場": 
            return createDisposeAndDrawEffect(3, 7);
        case "造船所":
            return createDisposeAndDrawEffect(3, 6);
    
        // Mecenat
        case "遊園地":
            return createDisposeHandAndEarnEffect(2, 25);
        case "食品工場":
            return createDisposeAndDrawEffect(2, 4);
        case "食堂":
            return createDisposeHandAndEarnEffect(1, 8);

        // Glory
        case "蒸気工場":
            return createDisposeAndDrawEffect(2, 4);
        case "劇場":
            return createDisposeHandAndEarnEffect(2, 20);
        case "機関車工場":
            return createDisposeAndDrawEffect(3, 7);
    
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

        // Glory
        case "農村":
            return {
                command: rural,
                resolve: (resolver: AsyncResolver) => {
                    const r = resolver as OptionSelectionCommand;
                    const effect = [drawConsumerGoods(2), concatSyncEffect(disposeConsumerGoods(2), drawBuilding(3))][r.index]
                    return effect.affect;
                }
            };

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

        // Mecenat
        case "大聖堂":
        case "旧市街":
        case "会計事務所":
        case "墓地":
        case "輸出港":
        case "鉄道駅":
        case "投資銀行":
        case "植物園":
        case "博物館":
            return "notforuse";

        // Glory
        case "遺物":
        case "記念碑":
        case "消費者組合":
        case "ギルドホール":
        case "象牙の塔":
        case "革命広場":
        case "収穫祭":
        case "技術展示会":
        case "浄火の神殿":
            return "notforuse";

        default:
            return "notforuse";
    }
}