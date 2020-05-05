import { CardName } from "model/protocol/game/card";
import State from "monad/state/state";
import { Player } from "model/protocol/game/player";
import { Game, GameIO } from "model/protocol/game/game";
import { InRoundState } from "model/protocol/game/state";
import { Board } from "model/protocol/game/board";

export function addToHand(cards: CardName[]): State<Player, CardName[]> {
    return State
        .get<Player>()
        .modify(p => ({...p, hand: p.hand.concat(cards)}))
        .map(_ => cards);
}

export function removeFromHand(targets: number[]): State<Player, CardName[]> {
    return State
        .get<Player>()
        .map(p => targets.map(t => p.hand[t]))
        .modify(p => ({...p, hand: p.hand.filter((_, i) => !targets.includes(i))}))
}

export function handToBuildings(targets: number[]): State<Player, CardName[]> {
    return removeFromHand(targets)
        .flatMap(cards => 
            State
            .get<Player>()
            .modify(p => ({
                ...p, 
                buildings: p.buildings.concat(cards.map(c => ({card: c, workersOwner: []})))
            }))
            .map(_ => cards)
        );
}

export function onCurrentPlayer<T>(state: State<Player, T>): State<Game, [T, Player]> {
    return State
        .get<Game>()
        .flatMap(g => {
            const currentPlayer = (g.state as InRoundState).currentPlayer;
            const index = Object.values(g.board.players).findIndex(p => p.id == currentPlayer)!;
            const [t, override] = state.run(g.board.players[index]);
            const players = {
                ...g.board.players,
                [index]: override
            };
            return new State(g => [[t, override], {...g, board: {...g.board, players: players}}]);
        });
}

export function drawBuildings(amount: number): State<GameIO, {cards: CardName[], shuffled: boolean}> {
    return State
        .get<GameIO>()
        .flatMap(gameIO => {
            const board = gameIO.game.board;
            const shuffled = board.deck.length < amount;
            const ontheway = shuffled ? {...board, deck: board.deck.concat(gameIO.shuffle(board.trash)), trash: []} : board;
            const toBoard: Board = {...ontheway, deck: ontheway.deck.slice(amount)};
            const drawn = ontheway.deck.slice(0, amount);

            return State
                .put({...gameIO, game: {...gameIO.game, board: toBoard}})
                .map(_ => ({cards: drawn, shuffled: shuffled}));
        });
}

export function addToTrash(cards: CardName[]): State<Board, CardName[]> {
    return State
        .get<Board>()
        .modify(b => ({...b, trash: b.trash.concat(cards)}))
        .map(_ => cards);
}

export function onBoard<T>(state: State<Board, T>): State<Game, T> {
    return State
        .get<Game>()
        .flatMap(g => { 
            const [t, b] = state.run(g.board);
            return new State(g => [t, {...g, board: b}]);
        });
}

export function currentPlayer(): State<Game, Player> {
    return State
        .get<Game>()
        .map(game => {
            const currentId = (game.state as InRoundState).currentPlayer;
            return Object.values(game.board.players).find(p => p.id == currentId)!;
        });
}

export function lift<T>(state: State<Game, T>): State<GameIO, T> {
    return State
        .get<GameIO>()
        .flatMap(gameIO => {
            const result = state.run(gameIO.game);
            return State
                .put({...gameIO, game: result[1]})
                .map(_ => result[0]);
        });
}