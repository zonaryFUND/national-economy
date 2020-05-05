import * as React from "react";
import { GameProps, withGame } from "./context/game";
import cardFactory from "factory/card";
import { wage } from "model/protocol/game/board";
import * as style from "./mystatus.module.styl";
import { InRoundState } from "model/protocol/game/state";
const money = require("public/money.svg");
const city = require("public/city.svg");
const wageicon = require("public/wage.svg");

const mystatus: React.FC<GameProps> = props => {
    const me = Object.values(props.game.board.players).find(p => p.id == props.me);
    if (me == undefined) return null;

    const buildingsTotal = me.buildings
        .map(b => cardFactory(b.card))
        .filter(c => !c.buildingType.includes("unsellable"))
        .map(c => c.score || 0)
        .reduce((prev, current) => prev + current, 0);
    const paidWage = wage(props.game.board.currentRound) * me.workers.employed;
    const currentOnInRound = (props.game.state as InRoundState).currentPlayer != undefined;

    return (
        <section className={style.mystatus}>
            <div>
                <h3>
                    あなたの資産
                </h3>
                <p><img src={money} />現金：<span>${me.cash}</span></p>
                <p><img src={city} />売却できる建物の合計価値：<span>${buildingsTotal}</span></p>
                <p><img src={wageicon} />支払い予定賃金総額：<span className={me.cash < paidWage ? style.penalty : undefined}>${paidWage}</span></p>
            </div>
            {
                !currentOnInRound || me.cash >= paidWage ? null :
                me.cash + buildingsTotal >= paidWage ? <p className={style.sell}>ラウンド終了時までに現金を稼がないと、建物を売ることになります</p> :
                <p className={style.penalty}>ラウンド終了時までに現金を稼ぐか売却可能な建物を建てないと、未払い賃金ペナルティを課せられることになります</p>
            }
        </section>
    )
};

export default withGame(mystatus);