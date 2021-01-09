import * as React from "react";
import { GameProps, withGame } from "../context/game";
import { GatewayProps, withGateway } from "../context/gateway";
import { InRoundState } from "model/protocol/game/state";
import ConstructionCompany from "./constructioncompany";

const selection: React.FC<GameProps & GatewayProps> = props => {
    const state = props.game.state as InRoundState;
    if (state.effecting?.card == "設計事務所") {
        return <ConstructionCompany />
    }

    return null;
};

export default withGateway(withGame(selection));