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
            return true;
        } else {return false};
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
            return 'tie';
        }
        
        // Check for horizontal win
        for (row of boardWithCellValues) {
            if ((row[0] === row[1] && row[1] === row[2]) && (row[0] !== '')) {
                console.log('winner!');
                return 'win';
            }
        }

        // Check for vertical win
        for (let i = 0; i < 3; i++) {
            if ((boardWithCellValues[0][i] === boardWithCellValues[1][i] && boardWithCellValues[1][i] === boardWithCellValues[2][i]) && boardWithCellValues[0][i] !== '') {
                console.log('winner!');
                return 'win';
            }
        }
        
        
        // Check for diagonal win
        if (((boardWithCellValues[0][0] === boardWithCellValues[1][1] && boardWithCellValues[1][1] === boardWithCellValues[2][2]) || 
            (boardWithCellValues[0][2] === boardWithCellValues[1][1] && boardWithCellValues[1][1] === boardWithCellValues[2][0])) && 
            boardWithCellValues[1][1] !== '') {
            console.log('winner!');
            return 'win';
        }
    }

    // Print board
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    };

    return { getBoard, checkSquare, checkWin, printBoard };
})();

function GameController(playerOneName = 'Player One', playerTwoName = 'Player Two') {

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
        const success = board.checkSquare(row, column, getActivePlayer().symbol);
        if (!success) return;
        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();


    return {
        playRound,
        getActivePlayer
    };
}

(function() {

    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const nameForm = document.querySelector('.name-form');
    const startButton = document.querySelector('.start-button');

    startButton.addEventListener('click', clickStartHandler);

    
    const refreshButton = document.getElementById('refresh');
    refreshButton.addEventListener('click', clickHandlerRefresh);
    
    
    function clickHandlerRefresh() {
        window.location.reload();
    }

    let game;

    function clickStartHandler(e) {
        e.preventDefault();
        formData = new FormData(nameForm);
        const playerOneName = formData.get('player-one');
        const playerTwoName = formData.get('player-two');
        console.log(playerOneName, playerTwoName);
        game = GameController(playerOneName, playerTwoName);
        updateScreen();
    }

    function updateScreen() {

        boardDiv.textContent = '';

        nameForm.style.display = 'none';
        refreshButton.style.display = 'block';

        const refreshedBoard = board.getBoard();
        const activePlayer = game.getActivePlayer();

        const gameEnd = board.checkWin();

        if (!gameEnd) {
            playerTurnDiv.textContent = `${activePlayer.name}'s turn.`;
        } else {
            playerTurnDiv.textContent = 'Game Over!!!'
            boardDiv.removeEventListener('click', clickHandlerBoard);
            const winner = activePlayer.name === 'Player One' ? 'Player Two' : 'Player One';
            const winnerAnnounce = document.createElement('h2');
            if (gameEnd === 'win') {
                winnerAnnounce.textContent = `${winner} wins!`
            } else {
                winnerAnnounce.textContent = "It's a tie!"
            }
            playerTurnDiv.insertAdjacentElement('afterend', winnerAnnounce);
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
        });

        


        function clickHandlerBoard(e) {
            const selectedRow = e.target.dataset.row;
            const selectedColumn = e.target.dataset.column;
            if (!selectedColumn || !selectedRow) return;
    
            game.playRound(selectedRow, selectedColumn);
            updateScreen();
        }
    
        boardDiv.addEventListener('click', clickHandlerBoard);
    }

    

})();