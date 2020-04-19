import * as React from "react";
import Card from "./atoms/card";
import { Card as CardEntity } from "entity/card";
import * as style from "./cards.styl";

interface Props {
    title: string;
    cards: CardEntity[];
}

const hand: React.FC<Props> = props => {
    const cards = props.cards.map(c => <Card card={c} />);

    return (
        <section className={style.cards}>
            <h2>{props.title}</h2>
            <ul>{cards}</ul>
        </section>
    );
};

export default hand;