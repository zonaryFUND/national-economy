import * as React from "react";
import * as style from "./card.module.styl";
import { CardName } from "model/protocol/game/card";
import cardFactory from "factory/card";
import CardType from "./card-type";

interface Props {
    card: CardName;
    activeRound?: number;
    onClick?: () => void;
}

const card: React.FC<Props> = props => {
    const card = cardFactory(props.card);

    const cardStyle = (() => {
        switch (card.type) {
            case "building":        return style.building;
            case "public":          return style.public;
            case "consumer-goods":  return style.consumergoods;
        }
    })();

    const cardType = (() => {
        switch (card.type) {
            case "building":        return "建物カード";
            case "consumer-goods":  return null;
            case "public":          return "公共職場カード";
        }
    })();

    const description = card.description.split("|").map(str => {
        if (str == "agricultural" || str == "industrial" || str == "unsellable") 
            return <CardType type={str} />;
        const arr = str.split("\n").map(t => <>{t}</>);
        return arr.reduce((prev, current) => prev.concat(<br />).concat(current), [] as React.ReactNode[]);
    });

    return (
        <li className={`${style.card} ${cardStyle}`} onClick={props.onClick} style={props.onClick ? {cursor: "pointer"} : undefined}>
            <header style={card.cost ? {paddingLeft: 20} : undefined}>{card.cost ? <p>{card.cost}</p> : null}<h3>{card.name}</h3></header>
            <div className={style.img}>
                <img src={card.imageURL} />
            </div>
            <footer>
                {card.score != undefined ? <p>{card.score}</p> : null}
                {card.buildingType.length > 0 ? <ul className={style.icons}>{
                    card.buildingType.map(b => <CardType type={b} />)
                }</ul> : null}
            </footer>
            <p className={style.tooltip}>
                {card.name}<br />
                {cardType ? <>{cardType}<br /></> : null}
                {card.cost ? <>建設コスト{card.cost}<br /></> : null}
                {description}<br /><br />
                {card.score != undefined ? `資産価値：$${card.score}` : null}
            </p>
            {
                props.activeRound ?
                <div className={style.cover}>
                    <p>ラウンド<span>{props.activeRound}</span><br />から解禁</p>
                </div> :
                null
            }
            {props.children}
        </li>
    );
};

export default card;