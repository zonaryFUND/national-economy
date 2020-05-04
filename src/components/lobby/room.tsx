import * as React from "react";
import { Room } from "entity/room";

interface Props {
    name: string;
    room: Room;
}

const room: React.FC<Props> = props => {
    const playerNodes = props.room.players?.map(p => (
        <li>
            <p>{p}</p>
        </li>
    ));

    return (
        <section>
            <header><h2>{props.name}</h2></header>
            {props.room.game_id ? <p>GameID: {props.room.game_id}</p> : <p>空き</p>}
            <h3>参加者</h3>
            <ul>
                {playerNodes}
            </ul>
        </section>
    );
};

export default room;