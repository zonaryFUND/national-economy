import * as React from "react";
import * as style from "./entrance.module.styl";
import useObservable from "components/common/use-observable";
import { Observable } from "rxjs";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Room } from "entity/room";
import { Game } from "model/protocol/game/game";
import { launch } from "model/launch";
import Fire from "components/room/fire";

interface Props extends RouteComponentProps<{id: string}> {
    room: (id: string) => Observable<Room>;
    join: (id: string, name: string) => void;
    finish: (id: string) => void;
    leave: (id: string, name: string) => void;
    createGame: (id: string, game: Game) => void;
}

const entrance: React.FC<Props> = props => {
    const [myname, setMyname] = React.useState<string | undefined>(undefined);
    const [room, error, unsubscribe] = useObservable(props.room(props.match.params.id));
    const [canJoin, setCanJoin] = React.useState(false);

    React.useEffect(() => {
        if (myname) {
            const leave = () => {
                if (myname) props.leave(props.match.params.id, myname);
            };

            props.join(props.match.params.id, myname);
            window.addEventListener("beforeunload", leave);

            return () => {
                leave();
                window.removeEventListener("beforeunload", leave);
            };
        }

        return () => {};
    }, [myname]);

    if (room && !room.game_id) {
        const players = room.players.map(p => <li key={p}>{p}</li>);

        const onJoin = () => {
            const name = (document.getElementById("name") as HTMLInputElement).value;
            setMyname(name);
        };

        const onInput = (e: React.ChangeEvent<HTMLInputElement>) => setCanJoin(e.target.value.length > 0);

        const onStart = () => {
            props.createGame(props.match.params.id, launch(room.players));
        };

        return (
            <article className={style.entrance}>
                <div>
                    <h2>Room{props.match.params.id}</h2>
                    <h3>参加者</h3>
                    <ul>{players}</ul>
                    {myname != undefined && room.players[0] == myname ?
                        <button onClick={onStart}>ゲーム開始</button> :
                        myname && room.players.length > 0 ?
                        <p>{`${room.players[0]}の開始を待っています`}</p> :
                        null
                    }
                    {myname == undefined && room.players.length < 4 ?
                        <>
                            <input id="name" onChange={onInput} />
                            <button onClick={onJoin} disabled={!canJoin}>参加</button>
                        </> :
                        null
                    }
                </div>
            </article>
        );
    } else if (room && room.game_id) {
        unsubscribe();
        return <Fire myname={myname} id={room.game_id} setMyname={setMyname} onFinish={() => props.finish(props.match.params.id)} />;
    } else {
        return <h1>loading</h1>;
    }
};

export default withRouter(entrance);