import * as React from "react";
import { GameProps, withGame } from "../context/game";
import { GatewayProps, withGateway } from "../context/gateway";
import { InRoundState } from "model/protocol/game/state";
import ConstructionCompany from "./constructioncompany";
import Options from "./options";
import { cardEffect, AsyncCardEffect } from "model/interaction/game/card-effects";
import { OptionsRequest } from "model/interaction/game/async-command";

const selection: React.FC<GameProps & GatewayProps> = props => {
    const state = props.game.state as InRoundState;
    if (state.effecting == undefined) return null;
    const effecting = state.effecting;
    if (effecting.card == undefined) return null;
    const effect = cardEffect(effecting.card) as AsyncCardEffect;
    if (effect.command == undefined) return null;

    if (effect.command.name == "design-office") {
        return <ConstructionCompany />
    }
    
    const options = effect.command.name as OptionsRequest;
    if (options.options != undefined) {
        return <Options />
    }

    return null;
};

export default withGateway(withGame(selection));