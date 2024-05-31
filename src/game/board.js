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

    console.log('rerun');
    return getApplePlace(board);
}

export const getNextBoard = (snake, apple) => {
    const board = Array.from({ length: height }, (_, y) => (
        Array.from({ length: width }, (__, x) => (
            snake.some(p => p.x === x && p.y === y)
        ))
    ));

    console.log(apple);
    const { x, y } = apple ?? getApplePlace(board);
    board[y][x] = true;

    return { board, apple: { x, y } };
};

export const getNextPosition = (move, snake, board, apple) => {
    const newPos = {
        x: snake[0].x,
        y: snake[0].y,
    };

    // TODO do nothing on back move
    if (move === 'L') {
        newPos.x--;
    } else if (move === 'R') {
        newPos.x++;
    } else if (move === 'U') {
        newPos.y--;
    } else if (move === 'D') {
        newPos.y++;
    }

    const newSnake = [ newPos, ...snake.slice(0, -1) ];
    const result = getNextBoard(newSnake, apple);

    return {
        point: true,
        gameOver: false,
        snake: newSnake,
        board: result.board,
        apple,
    };
}
