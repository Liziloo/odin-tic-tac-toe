(function Gameboard () {
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
        if (!board[row][column].getValue() === null) return;

        board[row][column].markSquare(player);
    };

    // Print board
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    };

    return { getBoard, checkSquare, printBoard };
})();

