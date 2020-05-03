import * as React from "react";
import { PlayerIdentifier } from "model/protocol/game/player";
import * as style from "./worker.module.styl";
import { GameProps, withGame } from "../context/game";

export type WorkerStatus = "fetched" | "onestate" | "training" | "empty";

interface Props extends GameProps {
    owner: PlayerIdentifier;
    status?: WorkerStatus;
}

const worker: React.FC<Props> = props => {
    const parentStyle = (() => {
        switch (props.owner) {
            case "red":     return style.red;
            case "blue":    return style.blue;
            case "orange":  return style.orange;
            case "purple":  return style.purple;
        }
    })();

    const title = (() => {
        switch (props.status) {
            case "fetched":     return "派遣済みの労働者です。";
            case "onestate":    
                const player = props.game.board.players.find(p => p.id == props.owner);
                return `${player?.name || props.owner}が派遣した労働者です。`;
            case "training":    return "研修中の労働者です。派遣はできませんが、賃金は満額発生します。";
            case "empty":       return "空席です。この数だけ労働者を追加雇用できます。";
            case undefined:     return "未派遣の労働者です。";
        }
    })();

    const src = (() => {
        if (props.status == "training") return "https://3.bp.blogspot.com/-qRt6UrnektI/Wc8f7Ps8Y5I/AAAAAAABHJQ/0fvRqb00sYgut77lyvAp0W8nMfeZAcf4wCLcBGAs/s400/study_man_normal.png";
        if (props.status == "empty") return undefined;
        return "https://4.bp.blogspot.com/-FkxvQEt8SFY/UZmB90dIsvI/AAAAAAAATYo/pzQe_1qm0mc/s400/job_kouji.png";
    })();

    return (
        <li className={`${style.worker} ${parentStyle}`} title={title}>
            <img src={src} style={props.status == "fetched" ? {opacity: 0.2} : undefined} />
        </li>
    );
};

export default withGame(worker);