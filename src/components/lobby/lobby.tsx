import * as React from "react";
import * as style from "./lobby.module.styl";
import Room from "./room";
import Repository from "components/common/repository";
import { Room as RoomEntity } from "entity/room";
import useObservable from "components/common/use-observable";
import { Link } from "react-router-dom";

const lobby: React.FC<Repository<RoomEntity[]>> = props => {
    const [rooms, _] = useObservable(props.stream);
    const roomsNode = rooms ? rooms.map((r, i) => (
        <Link to={`/${i + 1}`}>
            <Room name={`Room${i + 1}`} room={r} />
        </Link>
    )) : null;

    return (
        <article className={style.lobby}>
            <div>
            {roomsNode}
            </div>
        </article>
    );
};

export default lobby;