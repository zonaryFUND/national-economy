import * as React from "react";
import { GameProps, withGame } from "../context/game";
import { GatewayProps, withGateway } from "../context/gateway";
import { InRoundState } from "model/protocol/game/state";
import Card from "../atoms/card";

const constructionCompany: React.FC<GameProps & GatewayProps> = props => {
    const state = props.game.state as InRoundState;
    const isMine = props.me == state.currentPlayer;
    
    const cards = state.revealing?.map((c, i) => {
        const onClick = () => props.resolve({targetIndex: i});
        return<Card card={c} onClick={isMine ? onClick : undefined} />;
    });

    return (
        <section>
            <h3>設計事務所によって公開されたカード</h3>
            <ul>{cards}</ul>
        </section>
    );
};

export default withGateway(withGame(constructionCompany));