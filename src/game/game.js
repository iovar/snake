import { getNextBoard, getNextPosition } from './board.js';

export const MAX_LEVEL = 20;

const initSnake = [
    { x: 12, y: 12 },
    { x: 13, y: 12 },
    { x: 14, y: 12 },
    { x: 15, y: 12 },
];

const getInitState = () => {
    const { board, apple } = getNextBoard(initSnake);
    return {
        snake: initSnake,
        board,
        apple,
    };
}

const moves = [
    'L',
    'U',
    'D',
    'R',
];

const isSameOrOpposite = (move1, move2) => (
    [move1, move2].every((m) => ['L', 'R'].includes(m)) // LL, LR, RR
    || [move1, move2].every((m) => ['U', 'D'].includes(m)) // UU, UD, DD
);

function* gameEngine() {
    let { snake, board, apple } = getInitState();

    let score = 0;
    let gameOver = false;
    let move = 'L';

    while (!gameOver) {
        const code = yield({ board, score, gameOver });
        if (code !== undefined && !isSameOrOpposite(move, moves[code])) {
            move = moves[code];
        }

        const result = getNextPosition(move, snake, board, apple);

        snake = result.snake;
        board = result.board;
        apple = result.apple;
        gameOver = result.gameOver;
        score += result.point ? 1 : 0;
    }

    yield({ board, score, gameOver });
}

export function startGame(level = 0, callback) {
    const game = gameEngine();
    const play = (move) => game.next(move);

    let playing = true;

    const startGameLoop = () => {
        const timer = setInterval(() => {
            const { value, done } = game.next();
            playing = !done;
            if (!playing) {
                clearInterval(timer);
                return;
            }

            callback(value);
        }, (40 * (21 - level)));
    }

    startGameLoop();
    play();
    return { play };
}
