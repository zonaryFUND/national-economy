import * as React from "react";
import Card from "./atoms/card";
import * as style from "./cards.styl";
import { CardName } from "model/protocol/game/card";
import { Building } from "model/protocol/game/building";
import Workers from "./atoms/workers";

interface Props {
    title: string;
    tooltip?: string;
    cards?: CardName[];
    buildings?: Building[];
}

const hand: React.FC<Props> = props => {
    const cards = props.cards ? props.cards.map((c, i) => <Card card={c} key={`${i}-${c}`} />) : null;
    const buildings = props.buildings ? props.buildings.map((b, i) => (
        <Card card={b.card} key={`${i}-${b.card}`}>
            <Workers workers={b.workers} />
        </Card>
    )) : null;

    return (
        <section className={style.cards}>
            <h2 title={props.tooltip}>{props.title}</h2>
            {cards ? <ul>{cards}</ul> : null}
            {buildings ? <ul>{buildings}</ul> : buildings}
        </section>
    );
};

export default hand;