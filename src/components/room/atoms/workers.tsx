import * as React from "react";
import * as style from "./workers.module.styl";
import { PlayerIdentifier } from "model/protocol/game/player";
import Worker from "./worker";

interface Props {
    owners: PlayerIdentifier[];
}

const workers: React.FC<Props> = props => {
    if (props.owners.length == 0) return null;

    const workers = props.owners.map((o, i) => <Worker key={`${o}-${i}`} owner={o} status={"onestate"} />);
    const rows = Math.ceil(workers.length / 2);
    return <div className={style.workers}><ul style={{height: rows * 40}}>{workers}</ul></div>;
};

export default workers;
