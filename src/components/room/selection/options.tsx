import * as React from "react";
import { GameProps, withGame } from "../context/game";
import { GatewayProps, withGateway } from "../context/gateway";
import { InRoundState } from "model/protocol/game/state";
import { cardEffect, AsyncCardEffect } from "model/interaction/game/card-effects";
import { OptionsRequest } from "model/interaction/game/async-command";
import { getCurrentPlayer } from "model/protocol/game/game";

const options: React.FC<GameProps & GatewayProps> = props => {
    const state = props.game.state as InRoundState;
    const isMine = props.me == state.currentPlayer;
    const effecting = state.effecting;
    const player = getCurrentPlayer(props.game);
    if (!isMine || effecting == undefined || player == undefined) return null;

    const request = (cardEffect(effecting.card) as AsyncCardEffect).command.name as OptionsRequest;
    const buttons = request.options(player).map((o, i) => (
        <li key={o.text}>
            <button disabled={!o.available} onClick={() => props.resolve({index: i})}>{o.text}</button>
        </li>
    ));

    return (
        <section>
            <h3>{`${state.effecting?.card}の選択`}</h3>
            <ul>{buttons}</ul>
        </section>
    );
};

export default withGateway(withGame(options));