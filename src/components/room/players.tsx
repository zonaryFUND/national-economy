import * as React from "react";
import Player, { Player as PlayerProps} from "./player";
import * as style from "./players.module.styl";

interface Props {
    players: PlayerProps[];
}

const players: React.FC<Props> = props => {
    const players = props.players.map(p => <Player {...p} />);

    return (
        <section className={style.players}>
            <ul>{players}</ul>
        </section>
    );
};

export default players;