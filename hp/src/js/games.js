let randomNumber = Math.floor(Math.random() * 100) + 1;

function checkGuess() {
    const userGuess = document.getElementById('guess').value;
    const result = document.getElementById('result');

    if (userGuess == randomNumber) {
        result.textContent = 'Congratulations! You guessed the correct number!';
        result.style.color = 'green';
    } else if (userGuess > randomNumber) {
        result.textContent = 'Too high! Try again.';
        result.style.color = 'red';
    } else {
        result.textContent = 'Too low! Try again.';
        result.style.color = 'red';
    }
}

function castSpell() {
    const spellEffect = document.getElementById('spell-effect');
    spellEffect.innerHTML = '<div class="sparkle"></div>';
    setTimeout(() => {
        spellEffect.innerHTML = '';
    }, 1000);
}

function mixPotion() {
    const ingredient1 = document.getElementById('ingredient1').value;
    const ingredient2 = document.getElementById('ingredient2').value;
    const potionResult = document.getElementById('potion-result');

    potionResult.textContent = `You mixed ${ingredient1} and ${ingredient2} to create a magical potion!`;
    potionResult.style.color = 'purple';
}

const pieces = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

let selectedCell = null;
let currentPlayer = 'white';
let whiteKingPosition = { row: 7, col: 4 };
let blackKingPosition = { row: 0, col: 4 };
let enPassantTarget = null;

function createChessBoard() {
    const board = document.getElementById('chess-board');
    const initialBoard = [
        'rnbqkbnr',
        'pppppppp',
        '        ',
        '        ',
        '        ',
        '        ',
        'PPPPPPPP',
        'RNBQKBNR'
    ];

    for (let i = 0; i < 8; i++) {
        const row = document.createElement('div');
        row.className = 'chess-row';
        for (let j = 0; j < 8; j++) {
            const cell = document.createElement('div');
            cell.className = 'chess-cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.style.backgroundColor = (i + j) % 2 === 0 ? '#f0d9b5' : '#b58863';
            cell.textContent = pieces[initialBoard[i][j]] || '';
            cell.addEventListener('click', () => handleCellClick(cell));
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
}

function handleCellClick(cell) {
    if (selectedCell) {
        if (isValidMove(selectedCell, cell)) {
            movePiece(selectedCell, cell);
            selectedCell = null;
            if (isInCheck()) {
                // alert(`${currentPlayer === 'white' ? 'Black' : 'White'} has check on the king!`);
            } else if (isCheckmate()) {
                // alert(`${currentPlayer === 'white' ? 'White' : 'Black'} wins by checkmate!`);
            }
        } else {
            resetSelectedCell();
        }
    } else if (cell.textContent && isCurrentPlayerPiece(cell)) {
        selectedCell = cell;
        cell.style.backgroundColor = '#ffeb3b';
    }
}

function resetSelectedCell() {
    if (selectedCell) {
        selectedCell.style.backgroundColor = (parseInt(selectedCell.dataset.row) + parseInt(selectedCell.dataset.col)) % 2 === 0 ? '#f0d9b5' : '#b58863';
        selectedCell = null;
    }
}

function isValidMove(fromCell, toCell) {
    const fromRow = parseInt(fromCell.dataset.row);
    const fromCol = parseInt(fromCell.dataset.col);
    const toRow = parseInt(toCell.dataset.row);
    const toCol = parseInt(toCell.dataset.col);
    const piece = fromCell.textContent;

    // Prevent capturing own pieces
    if (toCell.textContent && isCurrentPlayerPiece(toCell)) {
        return false;
    }

    // Pawn moves
    if (piece === '♙' && currentPlayer === 'white') {
        return (fromRow - 1 === toRow && fromCol === toCol && !toCell.textContent) ||
               (fromRow - 2 === toRow && fromCol === toCol && fromRow === 6 && !toCell.textContent && !document.querySelector(`[data-row="${fromRow - 1}"][data-col="${fromCol}"]`).textContent) ||
               (fromRow - 1 === toRow && Math.abs(fromCol - toCol) === 1 && toCell.textContent && isOpponentPiece(toCell)) ||
               (fromRow - 1 === toRow && Math.abs(fromCol - toCol) === 1 && !toCell.textContent && enPassant(fromCell, toCell));
    } else if (piece === '♟' && currentPlayer === 'black') {
        return (fromRow + 1 === toRow && fromCol === toCol && !toCell.textContent) ||
               (fromRow + 2 === toRow && fromCol === toCol && fromRow === 1 && !toCell.textContent && !document.querySelector(`[data-row="${fromRow + 1}"][data-col="${fromCol}"]`).textContent) ||
               (fromRow + 1 === toRow && Math.abs(fromCol - toCol) === 1 && toCell.textContent && isOpponentPiece(toCell)) ||
               (fromRow + 1 === toRow && Math.abs(fromCol - toCol) === 1 && !toCell.textContent && enPassant(fromCell, toCell));
    }

    // Rook moves
    if (piece === '♖' || piece === '♜') {
        return (fromRow === toRow || fromCol === toCol) && isPathClear(fromCell, toCell);
    }

    // Knight moves
    if (piece === '♘' || piece === '♞') {
        return (Math.abs(fromRow - toRow) === 2 && Math.abs(fromCol - toCol) === 1) ||
               (Math.abs(fromRow - toRow) === 1 && Math.abs(fromCol - toCol) === 2);
    }

    // Bishop moves
    if (piece === '♗' || piece === '♝') {
        return Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol) && isPathClear(fromCell, toCell);
    }

    // Queen moves
    if (piece === '♕' || piece === '♛') {
        return (fromRow === toRow || fromCol === toCol || Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) && isPathClear(fromCell, toCell);
    }

    // King moves
    if (piece === '♔' || piece === '♚') {
        return (Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1) || castling(fromCell, toCell);
    }

    return false;
}

function isPathClear(fromCell, toCell) {
    const fromRow = parseInt(fromCell.dataset.row);
    const fromCol = parseInt(fromCell.dataset.col);
    const toRow = parseInt(toCell.dataset.row);
    const toCol = parseInt(toCell.dataset.col);

    const rowStep = Math.sign(toRow - fromRow);
    const colStep = Math.sign(toCol - fromCol);

    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;

    while (currentRow !== toRow || currentCol !== toCol) {
        if (document.querySelector(`[data-row="${currentRow}"][data-col="${currentCol}"]`).textContent) {
            return false;
        }
        currentRow += rowStep;
        currentCol += colStep;
    }

    return true;
}

function isCurrentPlayerPiece(cell) {
    const piece = cell.textContent;
    return (currentPlayer === 'white' && '♖♘♗♕♔♙'.includes(piece)) ||
           (currentPlayer === 'black' && '♜♞♝♛♚♟'.includes(piece));
}

function isOpponentPiece(cell) {
    const piece = cell.textContent;
    return (currentPlayer === 'white' && '♜♞♝♛♚♟'.includes(piece)) ||
           (currentPlayer === 'black' && '♖♘♗♕♔♙'.includes(piece));
}

function movePiece(fromCell, toCell) {
    toCell.textContent = fromCell.textContent;
    fromCell.textContent = '';
    resetSelectedCell();
    if ((currentPlayer === 'white' && toCell.dataset.row === '0') || (currentPlayer === 'black' && toCell.dataset.row === '7')) {
        toCell.textContent = '♕'; // Promote pawn to queen
    }
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
    enPassantTarget = null;
}

function isInCheck() {
    const kingPosition = currentPlayer === 'white' ? whiteKingPosition : blackKingPosition;
    const opponentPieces = currentPlayer === 'white' ? '♜♞♝♛♚♟' : '♖♘♗♕♔♙';
    const cells = document.querySelectorAll('.chess-cell');
    for (const cell of cells) {
        if (opponentPieces.includes(cell.textContent) && isValidMove(cell, document.querySelector(`[data-row="${kingPosition.row}"][data-col="${kingPosition.col}"]`))) {
            return true;
        }
    }
    return false;
}

function isCheckmate() {
    const kingPosition = currentPlayer === 'white' ? whiteKingPosition : blackKingPosition;
    const kingCell = document.querySelector(`[data-row="${kingPosition.row}"][data-col="${kingPosition.col}"]`);
    const cells = document.querySelectorAll('.chess-cell');
    for (const cell of cells) {
        if (cell.textContent && isCurrentPlayerPiece(cell)) {
            if (isValidMove(cell, kingCell)) {
                return false;
            }
        }
    }
    return true;
}

function enPassant(fromCell, toCell) {
    // Implement en passant logic
    const fromRow = parseInt(fromCell.dataset.row);
    const fromCol = parseInt(fromCell.dataset.col);
    const toRow = parseInt(toCell.dataset.row);
    const toCol = parseInt(toCell.dataset.col);

    if (enPassantTarget && enPassantTarget.row === toRow && enPassantTarget.col === toCol) {
        const capturedPawn = document.querySelector(`[data-row="${fromRow}"][data-col="${toCol}"]`);
        capturedPawn.textContent = '';
        return true;
    }
    return false;
}

function castling(fromCell, toCell) {
    // Implement castling logic
    const fromRow = parseInt(fromCell.dataset.row);
    const fromCol = parseInt(fromCell.dataset.col);
    const toRow = parseInt(toCell.dataset.row);
    const toCol = parseInt(toCell.dataset.col);

    if (Math.abs(fromCol - toCol) === 2 && fromRow === toRow) {
        const rookCol = toCol > fromCol ? 7 : 0;
        const rookTargetCol = toCol > fromCol ? toCol - 1 : toCol + 1;
        const rookCell = document.querySelector(`[data-row="${fromRow}"][data-col="${rookCol}"]`);
        const rookTargetCell = document.querySelector(`[data-row="${fromRow}"][data-col="${rookTargetCol}"]`);

        if (rookCell && rookCell.textContent.toLowerCase() === 'r' && isPathClear(fromCell, rookCell)) {
            movePiece(rookCell, rookTargetCell);
            return true;
        }
    }
    return false;
}

document.addEventListener('DOMContentLoaded', () => {
    createChessBoard();
});