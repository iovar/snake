const width = 30;
const height = 20;

const checkAppleChance = () => Math.random() <= (1 / (width * height));

const getApplePlace = (board) => {
    for (let y=0; y < height; y++) {
        for (let x=0; x < width; x++) {
            const hasIt = checkAppleChance();

            if (hasIt && !board[y][x]) {
                return { x, y };
            }
        }
    }

    return getApplePlace(board);
}

export const getNextBoard = (snake, apple) => {
    const board = Array.from({ length: height }, (_, y) => (
        Array.from({ length: width }, (__, x) => (
            snake.some(p => p.x === x && p.y === y)
        ))
    ));

    const { x, y } = apple ?? getApplePlace(board);
    board[y][x] = true;

    return { board, apple: { x, y } };
};

const outOfBounds = (pos) => (
    pos.x < 0  || pos.y < 0 || pos.x >= width || pos.y >= height
);

const selfBit = (pos, snake) => (
    snake.slice(0, -1).some(({ x, y }) => pos.x === x && pos.y === y)
);

export const getNextPosition = (move, snake, board, apple) => {
    const newPos = {
        x: snake[0].x,
        y: snake[0].y,
    };

    if (move === 'L') {
        newPos.x--;
    } else if (move === 'R') {
        newPos.x++;
    } else if (move === 'U') {
        newPos.y--;
    } else if (move === 'D') {
        newPos.y++;
    }

    const gameOver = outOfBounds(newPos) || selfBit(newPos, snake)

    if (gameOver) {
        return {
            point: false,
            gameOver: true,
            snake: snake,
            board: board,
            apple,
        };
    }

    const gotApple = newPos.x === apple.x && newPos.y === apple.y;
    const newSnake = gotApple
        ? [ newPos, ...snake ]
        : [ newPos, ...snake.slice(0, -1) ];
    const result = getNextBoard(newSnake, gotApple ? null : apple);

    return {
        point: gotApple,
        gameOver: false,
        snake: newSnake,
        board: result.board,
        apple: result.apple,
    };
}
