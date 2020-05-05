import * as React from "react";
import * as style from "./state.module.styl";
import { InRoundState, ExRoundState, ResultState } from "model/protocol/game/state";
import { getCurrentPlayer } from "model/interaction/game/util";
import { cardEffect, AsyncCardEffect } from "model/interaction/game/card-effects";
import { GameProps, withGame } from "./context/game";
import { PlayerIdentifier } from "model/protocol/game/player";
import { calcScore } from "model/interaction/game/score";
import { GatewayProps, withGateway } from "./context/gateway";
const money = require("public/money.svg");
const building = require("public/architecture-and-city.svg");
const angry = require("public/angry.svg");
const man = require("public/man.svg");
const star = require("public/star.svg");

function nameStyle(id: PlayerIdentifier): string {
    switch (id) {
        case "red":     return style.red;
        case "blue":    return style.blue;
        case "orange":  return style.orange;
        case "purple":  return style.purple;
    }
}

const state: React.FC<GameProps & GatewayProps> = props => {
    const inRound = props.game.state as InRoundState;
    if (inRound.currentPlayer) {
        const current = getCurrentPlayer(props.game)!;
        const currentMe = current.id == props.me;
        const turn = <><span className={nameStyle(current.id)}>{currentMe ? "あなた" : `${current.name || current.id}`}</span>のターンです</>;
        const detail = (() => {
            if (inRound.phase == "dispatching") return <p>{"労働者の派遣先を選んで" + (currentMe ? "ください" : "います")}</p>;

            const async = (cardEffect(inRound.effecting!) as AsyncCardEffect).command;
            return (
                <>
                    {inRound.effecting ? <h3>{`${inRound.effecting}の効果を解決中...`}</h3> : null}
                    <p>{currentMe ? async.directionMessage : async.awaitingMessage}</p>
                </>
            );
        })();

        return (
            <section className={style.state}>
                <h2>{turn}</h2>
                {detail}
            </section>
        )
    };

    const players = Object.values(props.game.board.players);
    const exRound = props.game.state as ExRoundState;
    if (exRound["red"] != undefined) {
        const status = Object.keys(exRound).map(id => {
            const me = id == props.me;
            const player = players.find(p => p.id == id)!;
            const s = nameStyle(id as PlayerIdentifier);
            const name = me ? <span className={s}>あなた</span> : <span className={s}>{`${player.name || player.id}`}</span>;
            switch (exRound[id]) {
                case "selling":
                    return <p key={id}>{name}は賃金を支払う現金が足りないため、売却する建物を選んでいます</p>;
                case "discarding":
                    return <p key={id}>{name}は手札が過剰なため、捨てる手札を選んでいます</p>;
                case "confirm":
                    return (
                        <>
                            <p key={id}>{name}はラウンド終了処理を完了しました(確認待ち)</p>
                            <button onClick={props.confirmCleanup}>OK</button>
                        </>
                    );
                case "finish":
                    return <p key={id}>{name}はラウンド終了処理を完了しました</p>;
            }
        });
        return (
            <section className={style.state}>
                <h3>ラウンド終了処理中...</h3>
                {status}
            </section>
        );
    }

    const result = props.game.state as ResultState;
    if (result.winner) {
        const header = (
            <tr>
                <th>名前</th>
                <th><img src={money} />現金</th>
                <th><img src={building} />不動産価値</th>
                <th><img src={angry} />未払賃金総額</th>
                <th><img src={man} />ボーナス</th>
                <th><img src={star} />スコア</th>
                <th>評価</th>
            </tr>
        );
        const table = players.map(player => {
            const score = calcScore(player);
            const rank = (() => {
                if (score.total >= 150) return "世界有数の時価総額";
                if (score.total >= 125) return "ハイテク分野に進出し業界最大シェア";
                if (score.total >= 100) return "一部上場企業として存続";
                if (score.total >= 75) return "地元自治体で「最も就職したい企業」に";
                if (score.total >= 50) return "民事再生を経て同業他社により買収";
                if (score.total >= 25) return "不正会計が発覚し破綻";
                return "評価なし";
            })();
            return (
                <tr className={nameStyle(player.id)}>
                    <td>{player.name || player.id}</td>
                    <td>{score.cash}</td>
                    <td>{score.buildings}</td>
                    <td>{score.penalty}</td>
                    <td>{score.bonus}</td>
                    <td>{score.total}</td>
                    <td>{rank}</td>
                </tr>
            );
        });

        return (
            <section className={style.state}>
                <h3>{`${result.winner}の勝利！`}</h3>
                <table>
                    <thead>{header}</thead>
                    <tbody>{table}</tbody>
                </table>
            </section>
        );
    }

    return null;
};

export default withGateway(withGame(state));