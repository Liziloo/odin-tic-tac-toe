const board =  (function() {
    const rows = 3;
    const cols = 3;
    const board = [];

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
        console.log(boardWithCellValues);
    };

    return { getBoard, checkSquare, printBoard };
})();

const game = (function () {

    const players = [
        {
            name: 'Player One',
            symbol: 'X'
        },
        {
            name: 'Player Two',
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
})();

(function() {

    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        boardDiv.textContent = '';

        const refreshedBoard = board.getBoard();
        const activePlayer = game.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn.`;

        refreshedBoard.forEach((row, index) => {
            const rowNumber = index;
            const newRow = document.createElement('div');
            newRow.classList.add('row');
            row.forEach((cell, index) => {
                const cellButton = document.createElement('button');
                cellButton.classList.add('cell');
                cellButton.dataset.column = index;
                cellButton.dataset.row = rowNumber;
                cellButton.textContent = cell.getValue();
                newRow.appendChild(cellButton);
            });
            boardDiv.appendChild(newRow);      
        })
    }

    function clickHandlerBoard(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;
        if (!selectedColumn || !selectedRow) return;

        game.playRound(selectedRow, selectedColumn);
        updateScreen();
    }

    boardDiv.addEventListener('click', clickHandlerBoard);

    updateScreen();
})();