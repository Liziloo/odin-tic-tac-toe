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

    const checkWin = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));

        // Check for tie
        let tieFound = true;
        for (row of boardWithCellValues) {
            for (cell of row) {
                if (cell === '') {
                    tieFound = false;
                    break
                }
            }
        }
        if (tieFound) {
            console.log('tie!')
            return true;
        }
        
        // Check for horizontal win
        for (row of boardWithCellValues) {
            if ((row[0] === row[1] && row[1] === row[2]) && (row[0] !== '')) {
                console.log('winner!');
                return true;
            }
        }

        // Check for vertical win
        for (let i = 0; i < 3; i++) {
            if ((boardWithCellValues[0][i] === boardWithCellValues[1][i] && boardWithCellValues[1][i] === boardWithCellValues[2][i]) && boardWithCellValues[0][i] !== '') {
                console.log('winner!');
                return true;
            }
        }
        
        
        // Check for diagonal win
        if (((boardWithCellValues[0][0] === boardWithCellValues[1][1] && boardWithCellValues[1][1] === boardWithCellValues[2][2]) || 
            (boardWithCellValues[0][2] === boardWithCellValues[1][1] && boardWithCellValues[1][1] === boardWithCellValues[2][0])) && 
            boardWithCellValues[1][1] !== '') {
            console.log('winner!');
            return true;
        }
    }

    // Print board
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    };

    return { getBoard, checkSquare, checkWin, printBoard };
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

        const gameEnd = board.checkWin();

        if (!gameEnd) {
            playerTurnDiv.textContent = `${activePlayer.name}'s turn.`;
        } else {
            playerTurnDiv.textContent = 'Game Over!!!'
            boardDiv.removeEventListener('click', clickHandlerBoard);
        }

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