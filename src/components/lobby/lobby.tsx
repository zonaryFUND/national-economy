import * as React from "react";
import Room from "./room";
import Repository from "components/common/repository";
import { Room as RoomEntity } from "entity/room";
import useObservable from "components/common/use-observable";

const lobby: React.FC<Repository<RoomEntity[]>> = props => {
    const rooms = useObservable(props.stream);
    const roomsNode = rooms ? rooms.map(r => (<Room {...r} />)) : null;

    return (
        <article>
            {roomsNode}
        </article>
    );
};

export default lobby;