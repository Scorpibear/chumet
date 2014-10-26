// Train chess memory
function Chumet() {
    //constants
    this.boardID = "chumetBoard";
    this.puzzle = null;

    this.start = function () {
        this.learningStrategy = new LearningStrategy();
        this.moveValidator = new MoveValidator();
        this.chessBoardConfig = new ChessBoardConfig(this.moveValidator);
        this.chessBoard = new ChessBoard(this.boardID, this.chessBoardConfig);
        this.showNextPuzzle();
        this.setupHandlers();
        this.chessBoard.onSnapEnd = this.updateBoard;
    };

    this.showNextPuzzle = function() {
        this.puzzle = this.learningStrategy.getNextPuzzle();
        this.resetPosition();
    };

    this.setupHandlers = function() {
        document.getElementById('retry').onclick = function() {
            chumet.resetPosition();
        };
        document.getElementById('best').onclick = function() {
            chumet.showBest();
        };
        document.getElementById('next').onclick = function() {
            chumet.showNextPuzzle();
        };
    };

    // update the board position after the piece snap
    // for castling, en passant, pawn promotion
    this.updateBoard = function() {
        this.chessBoard.position(this.moveValidator.chessGame.fen());
        $('#pgn').html(this.moveValidator.chessGame.pgn());
    };

    this.resetPosition = function() {
        var pgn = ['', this.puzzle.position].join('\n');
        this.moveValidator.chessGame.load_pgn(pgn);
        var orientation = (this.moveValidator.chessGame.turn() == 'w') ? 'white' : 'black';
        this.chessBoard.orientation(orientation);
        this.updateBoard();
        $('#status').html('');
    };

    this.showBest = function() {
        this.resetPosition();
        this.moveValidator.chessGame.move(this.puzzle.bestMove);
        this.updateBoard();
    };
};

var chumet =  new Chumet();