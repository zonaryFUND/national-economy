import * as React from "react";
import * as style from "./player.module.styl";
const cards = require("public/cards.svg");
const worker = require("public/worker.svg");
const report = require("public/report.svg");
const blank = require("public/blank.svg");
const money = require("public/money.svg");
const star = require("public/star.svg");
const angry = require("public/angry.svg");

export interface Player {
    name?: string;
    hand: {building: number, consumerGoods:number, max: number};
    workers: {available: number, training: number, employed: number, max: number};
    cash: number;
    penalty: number;
    score: number;
    startPlayer?: boolean;
    currentPlayer?: boolean;
    color: "red" | "green" | "blue" | "yellow";
}

const player: React.FC<Player> = props => {
    const colorStyle = (() => {
        switch (props.color) {
            case "blue":    return style.blue;
            case "green":   return style.green;
            case "red":     return style.red;
            case "yellow":  return style.yellow;
        }
    })();

    return (
        <li className={`${style.player} ${colorStyle}` + (props.currentPlayer ? ` ${style.current}` : "")}>
            <h2><p>{props.name || ""}</p>{props.startPlayer ? <p className={style.start}>スタートプレイヤー</p> : null}</h2>
            <section className={style.hand}>
                <h3>手札</h3>
                <p>{props.hand.building} <span>建物</span> + {props.hand.consumerGoods} <span>消費財</span> / {props.hand.max} <span>上限</span></p>
            </section>
            <section className={style.workers}>
                <h3>労働者</h3>
                <p>
                    {[...Array(props.workers.employed - props.workers.available - props.workers.training)].map(_ => <img className={style.dispatched} title="派遣済みの労働者です。" src={worker} />)}
                    {[...Array(props.workers.available)].map(_ => <img className={style.available} title="未派遣の労働者です。" src={worker} />)}
                    {[...Array(props.workers.training)].map(_ => <img src={report} className={style.training} title="研修中の労働者です。派遣はできませんが、賃金は満額発生します。" />)}
                    {[...Array(props.workers.max - props.workers.employed)].map(_ => <img src={blank} className={style.blank} title="空席です。この数だけ労働者を追加雇用できます。" />)}
                </p>
            </section>
            <section className={style.wealth}>
                <h3>資産</h3>
                <p>
                    <span title="現金です。"><img src={money}/>${props.cash}</span>
                    <span title="未払い賃金の総額です。$1につき勝利点から-3されます。" className={style.penalty}><img src={angry}/>${props.penalty}</span>
                    <span title="勝利点です。現金と建物の価値を足して、未払い賃金ペナルティを引いた値です。"><img src={star} />{props.score}</span>
                </p>
            </section>
        </li>
    );
};

export default player;