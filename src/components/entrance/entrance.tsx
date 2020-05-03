import * as React from "react";
import useObservable from "components/common/use-observable";
import { Observable } from "rxjs";
import Room from "../room/room";
import Start from "./start";

interface Props {
    fetchIngame: () => Observable<boolean>;
}

const entrance: React.FC<Props> = props => {
    const [ingame, error] = useObservable(props.fetchIngame());

    if (ingame == true) {
        //return <Room />;
        return null;
    } else if (ingame == false) {
        return <Start />;
    } else {
        return <h3>ロード中</h3>;
    }
};

export default entrance;