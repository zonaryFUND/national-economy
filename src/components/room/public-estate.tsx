import * as React from "react";
import Card from "./atoms/card";
import * as baseStyle from "./cards.styl";
import { GameProps, withGame, isWaitingFetch } from "./context/game";
import { GatewayProps, withGateway } from "./context/gateway";
import Workers from "./atoms/workers";

const publicEstate: React.FC<GameProps & GatewayProps> = props => {
    const fetching = isWaitingFetch(props);
    const onFetch = (to: "public" | "sold", index: number) => () => props.fetch(to, index);

    const carpenters = Math.max(Object.keys(props.game.board.players).length - 1, 1);
    const publicBuildings = props.game.board.publicBuildings.map((b, i) => {
        const activeRound = i < 3 + carpenters ? undefined : 
                            i - 1 - carpenters > props.game.board.currentRound ? i - 1 - carpenters : undefined;
        const onClick = fetching && activeRound == undefined ? onFetch("public", i) : undefined;
        return <Card key={`${b.card}-${i}`} card={b.card} activeRound={activeRound} onClick={onClick}><Workers owners={b.workersOwner} /></Card>;
    });
    const soldEstates = props.game.board.soldBuildings.map((b, i) => <Card key={`${b.card}-${i}`} card={b.card} onClick={fetching ? onFetch("sold", i) : undefined}><Workers owners={b.workersOwner} /></Card>);

    return (
        <section className={baseStyle.cards}>
            <h2>公共の建物</h2>
            <ul style={{marginBottom: 0}}>{publicBuildings}</ul>
            <ul style={{minHeight: 0}}>{soldEstates}</ul>
        </section>
    );
};

export default withGateway(withGame(publicEstate));