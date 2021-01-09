import * as React from "react";
import * as style from "./workers.module.styl";
import { PlayerIdentifier, WorkerType } from "model/protocol/game/player";
import Worker from "./worker";

interface Props {
    workers: {owner: PlayerIdentifier, type: WorkerType}[]
}

const workers: React.FC<Props> = props => {
    if (props.workers.length == 0) return null;

    const workers = props.workers.map((w, i) => <Worker key={`${w.owner}-${i}`} owner={w.owner} type={w.type} status={"onestate"} />);
    const rows = Math.ceil(workers.length / 2);
    return <div className={style.workers}><ul style={{height: rows * 40}}>{workers}</ul></div>;
};

export default workers;
