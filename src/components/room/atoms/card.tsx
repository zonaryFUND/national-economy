import * as React from "react";
import * as style from "./card.module.styl";
import { CardName } from "model/protocol/game/card";
import cardFactory from "factory/card";
const gear = require("public/gear.svg");
const hoe = require("public/hoe.svg");
const lock = require("public/lock.svg");

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

    const icons = card.buildingType.map(t => {
        switch (t) {
            case "agricultural": return <div title="この建物は農業に関する建物です" key={t}><img src={hoe} /></div>;
            case "industrial": return <div title="この建物は工業に関する建物です" key={t}><img src={gear} /></div>;
            case "unsellable": return <div title="この建物は施設であり、売却できません" key={t}><img src={lock} /></div>;
        }
    });

    return (
        <li className={`${style.card} ${cardStyle}`} onClick={props.onClick} style={props.onClick ? {cursor: "pointer"} : undefined}>
            <header style={card.cost ? {paddingLeft: 20} : undefined}>{card.cost ? <p>{card.cost}</p> : null}<h3>{card.name}</h3></header>
            <div className={style.img}>
                <img src={card.imageURL} />
            </div>
            <footer>
                {card.score != undefined ? <p>{card.score}</p> : null}
                {icons.length ? <ul className={style.icons}>{icons}</ul> : null}
            </footer>
            <p className={style.tooltip}>
                {card.name}<br />
                {cardType ? <>{cardType}<br /></> : null}
                {card.cost ? <>建設コスト{card.cost}<br /></> : null}
                <br />{card.description}<br /><br />
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