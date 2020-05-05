import * as React from "react";
import Card from "../atoms/card";
import * as style from "../cards.styl";
import * as selectStyle from "./select.styl";
import Workers from "../atoms/workers";
import { GameProps, withGame, isWaitingFetch, lackedCash } from "../context/game";
import { GatewayProps, withGateway } from "../context/gateway";
import cardFactory from "factory/card";

const estates: React.FC<GameProps & GatewayProps> = props => {
    const me = Object.values(props.game.board.players).find(p => p.id == props.me)!;

    const fetching = isWaitingFetch(props);
    const onFetch = (index: number) => () => props.fetch("occupied", index);

    const lack = lackedCash(props);
    const [selected, setSelected] = React.useState<number[]>([]);
    const sellable = me.buildings
        .map((b, i) => ({card: b.card, i: i}))
        .filter(b => {
            const card = cardFactory(b.card);
            return !card.buildingType.includes("unsellable") && card.cost != undefined;
        })
        .map(e => e.i);
    const value = me.buildings.filter((_, i) => selected.includes(i)).map(b => cardFactory(b.card).score || 0).reduce((p, c) => p + c, 0);
    const onSelect = (index: number) => () => {
        if (!sellable.includes(index)) return;

        if (selected.includes(index)) setSelected(selected.filter(e => e != index));
        else setSelected(selected.concat(index));
    };

    const onDone = () => {
        if (props.sell(selected)) {
            setSelected([]);
        }
    };
    const command = lack == undefined ? null : (
        <>
            <p>{`選択した建物の評価額：$${value}、不足金額：$${lack}`}</p>
            <button onClick={onDone} disabled={value < lack! && selected.length < sellable.length}>決定</button>
        </>
    );

    const buildings = me.buildings.map((b, i) => {
        const onClick = fetching ? onFetch(i) :
                        lack != undefined ? onSelect(i) : 
                        undefined;
        return (
            <Card card={b.card} key={`${i}-${b.card}`} onClick={onClick}>
                <Workers owners={b.workersOwner} />
                {selected.includes(i) ? <div className={`${selectStyle.overlay} ${selectStyle.selected}`} /> : null}
            </Card>
        );
    });

    return (
        <section className={style.cards}>
            <header>
                <h2>あなたの建物</h2>
                {command}
            </header>
            <ul>{buildings}</ul>
        </section>
    );
};

export default withGateway(withGame(estates));