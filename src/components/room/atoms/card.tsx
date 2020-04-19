import * as React from "react";
import { Card } from "model/interaction/game/card";
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

    const cardType = (() => {
        switch (props.card.type) {
            case "building":        return "建物カード";
            case "consumer-goods":  return null;
            case "public":          return "公共職場カード";
        }
    })();

    return (
        <li className={`${style.card} ${cardStyle}`}>
            <header>{props.card.cost ? <p>{props.card.cost}</p> : null}<h3>{props.card.name}</h3></header>
            <div>
                <img src={props.card.imageURL} />
            </div>
            <footer>{props.card.score ? <p>{props.card.score}</p> : null}</footer>
            <p className={style.tooltip}>
                {props.card.name}<br />
                {cardType ? <>{cardType}<br /></> : null}
                {props.card.cost ? <>建設コスト{props.card.cost}<br /></> : null}
                <br />{props.card.description}<br /><br />
                {props.card.score ? `資産価値：$${props.card.score}` : null}
            </p>
        </li>
    );
};

export default card;