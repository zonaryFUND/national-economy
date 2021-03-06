import * as React from "react";
import * as style from "./player.module.styl";
import Worker, { WorkerStatus } from "./atoms/worker";
import { calcScore } from "model/interaction/game/score";
import { GameProps, withGame } from "./context/game";
import { PlayerIdentifier } from "model/protocol/game/player";
import { InRoundState } from "model/protocol/game/state";
import { SeatContext, SeatProps } from "./fire";
const money = require("public/money.svg");
const star = require("public/star.svg");
const angry = require("public/angry.svg");

interface Props extends GameProps {
    id: PlayerIdentifier;
}

const player: React.FC<Props> = props => {
    const Seat: React.FC<SeatProps> = seat => {
        const onSeat = () => {
            seat.seat((document.getElementById("name") as HTMLInputElement).value, props.id);
        };
    
        const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            (document.getElementById("seat") as HTMLButtonElement).disabled = e.target.value.length == 0;
        };

        React.useEffect(() => {
            (document.getElementById("seat") as HTMLButtonElement).disabled = true;
        }, []);
    
        return (
            <>
                <input id="name" onChange={onNameChange} />
                <button onClick={onSeat} id="seat">着席</button>
            </>
        );
    };

    const colorStyle = (() => {
        switch (props.id) {
            case "red":     return style.red;
            case "blue":    return style.blue;
            case "orange":  return style.orange;
            case "purple":  return style.purple;
        }
    })();

    const shown = Object.values(props.game.board.players).find(p => p.id == props.id)!;

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
            <h2>
                {shown.name ? <p>{shown.name}</p> : <SeatContext.Consumer>{context => <Seat {...context!} />}</SeatContext.Consumer>}
                {isStart ? <p className={style.start}>スタートプレイヤー</p> : null}
            </h2>
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