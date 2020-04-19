import * as React from "react";
import Card from "./atoms/card";
import { Card as CardEntity } from "model/interaction/game/card";
import * as style from "./cards.styl";

interface Props {
    title: string;
    tooltip?: string;
    cards: CardEntity[];
}

const hand: React.FC<Props> = props => {
    const cards = props.cards.map(c => <Card card={c} />);

    return (
        <section className={style.cards}>
            <h2 title={props.tooltip}>{props.title}</h2>
            <ul>{cards}</ul>
        </section>
    );
};

export default hand;