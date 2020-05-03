import * as React from "react";
import State from "./state";
import Hand from "./me/hand";
import Cards from "./cards";
import PublicEstate from "./public-estate";
import * as style from "./room.module.styl";
import Environment from "./environment";
import Players from "./players";
import { GameProps, withGame } from "./context/game";
import Log from "./log";
import Estates from "./me/estates";
import Selection from "./selection/selection";
import Trash from "./trash";

interface Props extends GameProps {
    logs: string[];
}

const room: React.FC<Props> = props => {
    const [hand, estate] = (() => {
        if (props.me == undefined) return [null, null];
        return [<Hand />, <Estates />];
    })();

    const [showingTrash, setShowingTrash] = React.useState(false);

    const myIndex = props.me ? props.game.board.players.findIndex(p => p.id == props.me) : 0;
    const otherEstates = [...Array(props.game.board.players.length - 1).keys()]
        .map(i => (myIndex + i + 1) % props.game.board.players.length)
        .map(i => {
            const p = props.game.board.players[i];
            return <Cards buildings={p.buildings} title={`${p.name || p.id}の建物`} />;
        });

    return (
        <div className={style.base}>
            <div className={style.mainarea}>
                <State />
                <Environment showTrash={() => setShowingTrash(true)} />
                {showingTrash ? <Trash close={() => setShowingTrash(false)} /> : null}
                <Selection />
                {hand}
                {estate}
                <PublicEstate />
                {otherEstates}
                <div>Icons made by <a href="https://www.flaticon.com/authors/iconixar" title="iconixar">iconixar</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
                <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
                <div>Icons made by <a href="https://www.flaticon.com/authors/kiranshastry" title="Kiranshastry">Kiranshastry</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a></div>
                <div>Icons made by <a href="https://www.flaticon.com/authors/google" title="Google">Google</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a></div>
                <div>Icons made by <a href="https://www.flaticon.com/authors/dimitry-miroliubov" title="Dimitry Miroliubov">Dimitry Miroliubov</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a></div>
                <div>Icons made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a></div>
                <div>Icons made by <a href="https://www.flaticon.com/authors/eucalyp" title="Eucalyp">Eucalyp</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a></div>
                <div>Icons made by <a href="https://www.flaticon.com/authors/smalllikeart" title="smalllikeart">smalllikeart</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a></div>
            </div>
            <div className={style.subarea}>
                <Players />
                <Log logs={props.logs} />
            </div>
        </div>
    );
};

export default withGame(room);