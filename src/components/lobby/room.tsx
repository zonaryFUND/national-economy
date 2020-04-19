import * as React from "react";
import { Room } from "entity/room";

const room: React.FC<Room> = props => {
    const playerNodes = props.players.map(p => (
        <li>
            <p>{p}</p>
        </li>
    ));

    return (
        <section>
            <header><h3>{props.name}</h3></header>
            <ul>
                {playerNodes}
            </ul>
        </section>
    );
};

export default room;