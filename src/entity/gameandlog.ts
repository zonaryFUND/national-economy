import { Game } from "model/protocol/game/game";

export default interface GameAndLog extends Game {
    log: string[];
}