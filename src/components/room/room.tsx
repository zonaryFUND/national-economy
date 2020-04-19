import * as React from "react";
import Cards from "./cards";
import PublicEstate from "./public-estate";
import cardFactory from "factory/card";
import * as style from "./room.module.styl";
import Environment from "./environment";
import Players from "./players";

const room: React.FC = _ => {
    const handCards = [cardFactory("農場"), cardFactory("農場"), cardFactory("農場")];

    const environment= <Environment currentTurn={2} houseHold={10} />
    const hand = <Cards cards={handCards} title={`あなたの手札 ${handCards.length} / ${5}`} tooltip="手札が上限を超える場合、ラウンド終了時に超過分を捨てる必要があります。" />;
    const estate = <Cards cards={handCards} title={`あなたの建物`} />;
    const publicEstate = <PublicEstate soldEstates={handCards} currentTurn={1} playerCount={2} />;
    const otherEstates = ["player2の建物", "player3の建物", "player4の建物"].map(s => <Cards cards={handCards} title={s} />);

    const players = <Players players={[
        {
            name: "player1",
            hand: {building: 3, consumerGoods: 1, max: 5},
            workers: {available: 1, training: 1, employed: 3, max: 5},
            cash: 12,
            penalty: 0,
            score: 12,
            startPlayer: true,
            currentPlayer: true,
            color: "red"
        },
        {
            name: "player2",
            hand: {building: 3, consumerGoods: 1, max: 5},
            workers: {available: 1, training: 1, employed: 3, max: 5},
            cash: 12,
            penalty: 0,
            score: 12,
            color: "blue"
        },
        {
            name: "player3",
            hand: {building: 3, consumerGoods: 1, max: 5},
            workers: {available: 1, training: 1, employed: 3, max: 5},
            cash: 12,
            penalty: 0,
            score: 12,
            color: "green"
        },
        {
            name: "player4",
            hand: {building: 3, consumerGoods: 1, max: 5},
            workers: {available: 1, training: 1, employed: 3, max: 5},
            cash: 12,
            penalty: 0,
            score: 12,
            color: "yellow"
        }
    ]} />

    return (
        <div className={style.base}>
            <div className={style.mainarea}>  
                {environment}
                {hand}
                {estate}
                {publicEstate}
                {otherEstates}
                <div>Icons made by <a href="https://www.flaticon.com/authors/iconixar" title="iconixar">iconixar</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
                <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
                <div>Icons made by <a href="https://www.flaticon.com/authors/kiranshastry" title="Kiranshastry">Kiranshastry</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a></div>
                <div>Icons made by <a href="https://www.flaticon.com/authors/google" title="Google">Google</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a></div>
                <div>Icons made by <a href="https://www.flaticon.com/authors/dimitry-miroliubov" title="Dimitry Miroliubov">Dimitry Miroliubov</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a></div>
                <div>Icons made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a></div>
            </div>
            {players}
        </div>
    );
};

export default room;