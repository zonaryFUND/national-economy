import * as React from "react";
import Cards from "./cards";
import PublicEstate from "./public-estate";
import cardFactory from "factory/card";
import * as style from "./room.module.styl";

const room: React.FC = _ => {
    const handCards = [cardFactory("農場"), cardFactory("農場"), cardFactory("農場")];

    const hand = <Cards cards={handCards} title={`あなたの手札 ${handCards.length} / ${5}`} />;
    const estate = <Cards cards={handCards} title={`あなたの建物 ${handCards.length} / ${5}`} />;
    const publicEstate = <PublicEstate soldEstates={handCards} currentTurn={1} playerCount={2} />;

    return (
        <div className={style.mainarea}>  
            {hand}
            {estate}
            {publicEstate}
        </div>
    );
};

export default room;