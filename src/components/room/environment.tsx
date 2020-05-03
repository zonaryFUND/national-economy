import * as React from "react";
import * as style from "./environment.module.styl";
import { GameProps, withGame } from "./context/game";

interface Props extends GameProps {
    showTrash: () => void;
}

const environment: React.FC<Props> = props => {
    const currentWage = [2, 2, 3, 3, 3, 4, 4, 5, 5].map((w, i) => (
        <span key={i} className={style.wage + (i == props.game.board.currentRound - 1 ? ` ${style.currentwage}` : "")}>${w}</span>
    ));

    return (
        <section className={style.environment}>
            <h2>
                <p title="すべてのプレイヤーがすべての労働者を派遣すると、ラウンドが終了し賃金の支払いと手札の整理を行い、次のラウンドを開始します。">ラウンド<span>{props.game.board.currentRound}</span>/9</p>
                <p title="ラウンド終了時に労働者に支払う、1人あたりの金額です。額はラウンド数によって変化します。
                支払いができない場合、建物を売却して支払いに充てることができます。
                それでも足りなければ、$1あたり-3点のペナルティが最終スコアに課せられます。">賃金：{currentWage}/労働者1人</p>
                <p title="家計は市場に存在する金であり、労働者への給与支払によってのみ増加します。">家計：<span>${props.game.board.houseHold}</span></p>
                <p>山札：{props.game.board.deck.length}枚</p>
                <p>捨て札：{props.game.board.trash.length}枚<button onClick={props.showTrash}>見る</button></p>
            </h2>
        </section>
    );
};

export default withGame(environment);