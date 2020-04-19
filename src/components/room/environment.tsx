import * as React from "react";
import * as style from "./environment.module.styl";

interface Props {
    currentTurn: number;
    houseHold: number;
}

const environment: React.FC<Props> = props => {
    const currentWage = [2, 2, 3, 3, 3, 4, 4, 5, 5].map((w, i) => (
        <span className={style.wage + (i == props.currentTurn ? ` ${style.currentwage}` : "")}>${w}</span>
    ));

    return (
        <section className={style.environment}>
            <h2>
                <p title="すべてのプレイヤーがすべての労働者を派遣すると、ラウンドが終了し賃金の支払いと手札の整理を行い、次のラウンドを開始します。">ラウンド<span>{props.currentTurn + 1}</span>/9</p>
                <p title="ラウンド終了時に労働者に支払う、1人あたりの金額です。額はラウンド数によって変化します。
                支払いができない場合、建物を売却して支払いに充てることができます。
                それでも足りなければ、$1あたり-3点のペナルティが最終スコアに課せられます。">賃金：{currentWage}/労働者1人</p>
                <p title="家計は市場に存在する金であり、労働者への給与支払によってのみ増加します。">家計：<span>${props.houseHold}</span></p>
            </h2>
        </section>
    );
};

export default environment;