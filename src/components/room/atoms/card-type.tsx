import * as React from "react";
import * as style from "./card-type.module.styl";
const gear = require("public/gear.svg");
const hoe = require("public/hoe.svg");
const lock = require("public/lock.svg");

interface Props {
    type: "agricultural" | "industrial" | "unsellable";
}

const cardType: React.FC<Props> = props => {
    const [title, src] = (() => {
        switch (props.type) {
            case "agricultural": return ["この建物は農業に関する建物です",hoe];
            case "industrial": return ["この建物は工業に関する建物です", gear];
            case "unsellable": return ["この建物は施設であり、売却できません", lock];
        }
    })();

    return <div className={style.cardtype} title={title}><img src={src} /></div>;
};

export default cardType;