import * as React from "react";
import * as style from "./players.module.styl";
import { GameProps, withGame } from "./context/game";
import Player from "./player";

const players: React.FC<GameProps> = props => {
    const players = props.game.board.players.map(p => <Player id={p.id} key={p.id} />)

    return (
        <section className={style.players}>
            <ul>{players}</ul>
        </section>
    );
};

export default withGame(players);