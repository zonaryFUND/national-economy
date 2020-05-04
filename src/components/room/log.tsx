import * as React from "react";
import * as style from "./log.module.styl";

interface Props {
    logs: string[];
}

const log: React.FC<Props> = props => {
    const logs = props.logs?.map((l, i) => (
        <li key={i}>
            <p>{l}</p>
        </li>
    ));

    return (
        <section className={style.log}>
            <ul>{logs}</ul>
        </section>
    );
};

export default log;