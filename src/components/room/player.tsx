import * as React from "react";
import * as style from "./player.module.styl";
import Worker, { WorkerStatus } from "./atoms/worker";
import { calcScore } from "model/interaction/game/score";
import { GameProps, withGame } from "./context/game";
import { PlayerIdentifier } from "model/protocol/game/player";
import { InRoundState } from "model/protocol/game/state";
const cards = require("public/cards.svg");
const worker = require("public/worker.svg");
const report = require("public/report.svg");
const blank = require("public/blank.svg");
const money = require("public/money.svg");
const star = require("public/star.svg");
const angry = require("public/angry.svg");

interface Props extends GameProps {
    id: PlayerIdentifier;
}

const player: React.FC<Props> = props => {
    const colorStyle = (() => {
        switch (props.id) {
            case "red":     return style.red;
            case "blue":    return style.blue;
            case "orange":  return style.orange;
            case "purple":  return style.purple;
        }
    })();

    const shown = props.game.board.players.find(p => p.id == props.id)!;

    const handBuilding = shown.hand.filter(c => c != "消費財").length;
    const consumerGoods = shown.hand.length - handBuilding;
    const handMax = 5 + 4 * shown.buildings.filter(b => b.card == "倉庫").length;
    const workersMax = 5 + shown.buildings.filter(b => b.card == "社宅").length;
    const score = calcScore(shown).total;

    const isCurrent = (props.game.state as InRoundState).currentPlayer == props.id;
    const isStart = props.game.board.startPlayer == props.id;

    const CWorker: React.FC<{status?: WorkerStatus}> = w => <Worker owner={shown.id} status={w.status} />;

    return (
        <li className={`${style.player} ${colorStyle}` + (isCurrent ? ` ${style.current}` : "")}>
            <h2><p>{shown.name || ""}</p>{isStart ? <p className={style.start}>スタートプレイヤー</p> : null}</h2>
            <section className={style.hand}>
                <h3>手札</h3>
                <p>{handBuilding} <span>建物</span> + {consumerGoods} <span>消費財</span> / {handMax} <span>上限</span></p>
            </section>
            <section className={style.workers}>
                <h3>労働者</h3>
                <p>
                    {[...Array(shown.workers.employed - shown.workers.available - shown.workers.training).keys()]
                        .map(i => <CWorker status={"fetched"} key={i} />)}
                    {[...Array(shown.workers.available).keys()]
                        .map(i => <CWorker key={i} />)}
                    {[...Array(shown.workers.training).keys()]
                        .map(i => <CWorker status={"training"} key={i} />)}
                    {[...Array(workersMax - shown.workers.employed).keys()]
                        .map(i => <CWorker status={"empty"} key={i} />)}
                </p>
            </section>
            <section className={style.wealth}>
                <h3>資産</h3>
                <p>
                    <span title="現金です。"><img src={money}/>${shown.cash}</span>
                    <span title="未払い賃金の総額です。$1につき勝利点から-3されます。" className={style.penalty}><img src={angry}/>${shown.penalty}</span>
                    <span title="勝利点です。現金と建物の価値を足して、未払い賃金ペナルティを引き、ボーナスを加えた値です。"><img src={star} />{score}</span>
                </p>
            </section>
        </li>
    );
};

export default withGame(player);