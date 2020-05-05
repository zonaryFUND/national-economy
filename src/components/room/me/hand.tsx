import * as React from "react";
import Card from "../atoms/card";
import * as style from "../cards.styl";
import * as selectStyle from "./select.styl";
import { GameProps, withGame } from "../context/game";
import { InRoundState, ExRoundState } from "model/protocol/game/state";
import { cardEffect, AsyncCardEffect } from "model/interaction/game/card-effects";
import { DisposeRequest, BuildRequest } from "model/interaction/game/async-command";
import { GatewayProps, withGateway } from "../context/gateway";
import cardFactory from "factory/card";

const hand: React.FC<GameProps & GatewayProps> = props => {
    const me = Object.values(props.game.board.players).find(p => p.id == props.me)!;

    const inRoundState = props.game.state as InRoundState;
    const currentEffect = (() => {
        if (inRoundState.currentPlayer == undefined) return undefined;
        if (inRoundState.currentPlayer != props.me) return undefined;
        if (inRoundState.effecting == undefined) return undefined;

        const effect = cardEffect(inRoundState.effecting) as AsyncCardEffect;
        if (effect.command.name == "design-office") return undefined;
        return effect;
    })();

    const exRoundState = props.game.state as ExRoundState;
    const discarding = props.me != undefined && exRoundState[props.me] == "discarding";

    const [built, setBuilt] = React.useState<number[]>([]);
    const [selected, setSelected] = React.useState<number[]>([]);

    const reset = () => {
        setBuilt([]);
        setSelected([]);
    }

    const [command, selectionMax] = (() => {
        if (discarding) {
            const amount = me.hand.length - me.buildings.filter(b => b.card == "倉庫").length * 4 - 5;
            const onDone = () => {
                props.discard(selected);
                reset();
            };
            const node = (
                <>
                    <p>{`捨てるカードを${amount}枚選んでください`}</p>
                    <button onClick={onDone} disabled={selected.length != amount}>決定</button>
                </>
            );

            return [node, amount];
        }

        if (currentEffect == undefined) return [null, 0];

        // DisposeRequest
        const dispose = currentEffect.command.name as DisposeRequest;
        if (dispose.disposeCount != undefined) {
            const onDone = () => {
                props.resolve({targetHandIndices: selected});
                reset();
            };
            const node = (
                <>
                    <p>{`捨てるカードを${dispose.disposeCount}枚選んでください`}</p>
                    <button onClick={onDone} disabled={selected.length != dispose.disposeCount}>決定</button>
                </>
            );
            return [node, dispose.disposeCount];
        }

        // FreeBuild
        if (currentEffect.command.name == "free-build") {
            const onDone = () => {
                const resolver = {targetIndex: selected[0]};
                if (props.validate(resolver, currentEffect)) {
                    props.resolve(resolver);
                    reset();
                }
            };
            const node = (
                <>
                    <p>{`建てるカードを選んでください`}</p>
                    <button onClick={onDone} disabled={selected.length != 1}>決定</button>
                </>
            );
            return [node, 1];
        }

        // BuildRequest
        const build = currentEffect.command.name as BuildRequest;
        if (build.costCalclator != undefined) {
            if (built.length == 0) {
                const onDone = () => {
                    if (props.validate({built: selected[0]}, currentEffect)) {
                        setBuilt(selected);
                        setSelected([]);
                    }
                };
                const node = (
                    <>
                        <p>{`建てるカードを選んでください`}</p>
                        <button disabled={selected.length == 0} onClick={onDone}>決定</button>
                    </>
                );
                return [node, 1];
            } else {
                const cost = build.costCalclator(me.hand[built[0]], me);
                const onDone = () => {
                    props.resolve({built: built[0], discard: selected});
                    reset();
                }
                const node = <><p>{`コストとして捨てるカードを${cost}枚選んでください`}</p><button onClick={onDone} disabled={selected.length != cost}>決定</button></>;
                return [node, cost];
            }
        }

        // ComposeBuild
        if (currentEffect.command.name == "compose-build") {
            if (built.length == 0) {
                const onDone = () => {
                    if (props.validate({built: selected}, currentEffect)) {
                        setBuilt(selected);
                        setSelected([]);
                    }
                };
                const node = (
                    <>
                        <p>{`建てるカードを2枚選んでください`}</p>
                        <button disabled={selected.length != 2} onClick={onDone}>決定</button>
                    </>
                );
                return [node, 2];
            } else {
                const cost = cardFactory(me.hand[built[0]]).cost || 0;
                const onDone = () => {
                    props.resolve({built: built, discard: selected});
                    reset();
                }
                const node = <><p>{`コストとして捨てるカードを${cost}枚選んでください`}</p><button onClick={onDone} disabled={selected.length != cost}>決定</button></>;
                return [node, cost];
            }
        }

        return [null, 0];
    })();



    const cards = me.hand.map((c, i) => {
        const onClick = selectionMax == 0 || built.includes(i) ? undefined : () => {
            if (selected.includes(i)) setSelected(selected.filter(e => e != i));
            else if (selected.length == 1 && selectionMax == 1) {
                setSelected([i]);
            } else {
                if (selected.length == selectionMax) return;
                setSelected(selected.concat(i));
            }
        };

        return (
            <Card 
                card={c} 
                key={`${i}-${c}`} 
                onClick={onClick}
            >
                {selected.includes(i) ? <div className={`${selectStyle.overlay} ${selectStyle.selected}`} /> : null}
                {built.includes(i) ? <div className={`${selectStyle.overlay} ${selectStyle.built}`}><p>建設</p></div> : null}
            </Card>
        );
    });
    const handMax = 5 + me.buildings.filter(b => b.card == "倉庫").length * 4;

    return (
        <section className={style.cards}>
            <header>
                <h2 title="手札が上限を超える場合、ラウンド終了時に超過分を捨てる必要があります。">{`あなたの手札 ${cards.length} / ${handMax}`}</h2>
                {command}
            </header>
            {cards ? <ul>{cards}</ul> : null}
        </section>
    );
};

export default withGateway(withGame(hand));