import * as React from "react";
import Room from "./room";
import Repository from "components/common/repository";
import { Room as RoomEntity } from "entity/room";
import useObservable from "components/common/use-observable";

const lobby: React.FC<Repository<RoomEntity[]>> = props => {
    const [rooms, setRooms] = React.useState([] as RoomEntity[]);

    useObservable(() => props.stream.subscribe(setRooms));

    const roomsNode = rooms.map(r => (<Room {...r} />));

    return (
        <article>
            {roomsNode}
        </article>
    );
};

export default lobby;