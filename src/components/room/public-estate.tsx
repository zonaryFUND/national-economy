import * as React from "react";
import { Card as CardEntity } from "entity/card";
import Card from "./atoms/card";
import cardFactory from "factory/card";
import * as baseStyle from "./cards.styl";

interface Props {
    playerCount: number;
    currentTurn: number;
    soldEstates: CardEntity[];
}

const publicEstate: React.FC<Props> = props => {
    const publicBuildings0 = [cardFactory("採石場"), cardFactory("鉱山"), cardFactory("学校")];
    const carpenterCount = props.playerCount == 2 ? 1 :
                            props.playerCount == 3 ? 2 : 
                            3;
    const carpenters = [...Array(carpenterCount)].map(_ => cardFactory("大工"));
    const publicBuildings1 = [
        cardFactory("露店", props.playerCount),
        cardFactory("市場", props.playerCount),
        cardFactory("高等学校", props.playerCount),
        cardFactory("スーパーマーケット", props.playerCount),
        cardFactory("大学", props.playerCount),
        cardFactory("百貨店", props.playerCount),
        cardFactory("専門学校", props.playerCount),
        cardFactory("万博", props.playerCount)
    ];

    const publicBuildings = publicBuildings0.concat(...carpenters).concat(...publicBuildings1).map(c => <Card card={c} />);

    const soldEstates = props.soldEstates.map(c => <Card card={c} />);

    return (
        <section className={baseStyle.cards}>
            <h2>公共の建物</h2>
            <ul>{publicBuildings}</ul>
            <ul>{soldEstates}</ul>
        </section>
    );
};

export default publicEstate;