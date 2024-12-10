function Gameboard() {
    const rows = 3;
    const cols = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < cols; j++) {
            board[i].push(Cell());
        }
    }

    // Get entire board for UI
    const getBoard = () => board;

    // Function to check board for availability of chosen square
    const checkSquare = (row, column, player) => {
        // Check if square is already marked
        if (board[row][column].getValue() === '') {
            board[row][column].markSquare(player);
        } else {return};
    };

    // Print board
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log("board print 1", boardWithCellValues);
    };

    return { getBoard, checkSquare, printBoard };
}

function Cell() {
    let value = '';

    const markSquare = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        markSquare,
        getValue
    };
}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {

    const board = Gameboard();

    const players = [
        {
            name: playerOneName,
            symbol: 'X'
        },
        {
            name: playerTwoName,
            symbol: 'O'
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (row, column) => {
        console.log(
            `Placing ${getActivePlayer().name}'s marker in row ${row}, column ${column}.`
        );
        board.checkSquare(row, column, getActivePlayer().symbol);
        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();


    return {
        playRound,
        getActivePlayer
    };
};

const game = GameController();
