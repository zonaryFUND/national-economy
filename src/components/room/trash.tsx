import * as React from "react";
import { GameProps, withGame } from "./context/game";
import Card from "./atoms/card";
import * as style from "./cards.styl";

interface Props extends GameProps {
    close: () => void;
}

const trash: React.FC<Props> = props => {
    const cards = props.game.board.trash.map(c => <Card card={c} />);
    return (
        <section className={style.cards}>
            <header>
                <h3>捨て札</h3>
                <button onClick={props.close}>閉じる</button>
            </header>
            <ul>{cards}</ul>
        </section>
    );
};

export default withGame(trash);