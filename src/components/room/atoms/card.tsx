import * as React from "react";
import { Card } from "entity/card";
import * as style from "./card.module.styl";

interface Props {
    card: Card;
}

const card: React.FC<Props> = props => {
    const cardStyle = (() => {
        switch (props.card.type) {
            case "building":        return style.building;
            case "public":          return style.public;
            case "consumer-goods":  return style.consumergoods;
        }
    })();

    return (
        <li className={`${style.card} ${cardStyle}`}>
            <header>{props.card.cost ? <p>{props.card.cost}</p> : null}<h3>{props.card.name}</h3></header>
            <div>
                <img src={props.card.imageURL} />
            </div>
            <footer>{props.card.score ? <p>{props.card.score}</p> : null}</footer>
        </li>
    );
};

export default card;