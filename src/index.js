import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
      return (
        <button className="square" onClick={() =>  props.onClick()}>
          {props.value}
        </button>
      );
  }

  function FirstPick(props) {
    if(props.visible) {
      return (
        <button className="" onClick={() =>  props.onClick(3)}>
          {props.text}
        </button>
      );
    } else {
      return(<div></div>);
    }
  }

  function PlayerSelect(props) {
    if (props.onePlayer) { 
      return (
        <div>
        <button className="btn disabled" onClick={() =>  props.onClick(1)}>
          One Player
        </button>
        /
        <button className="btn" onClick={() =>  props.onClick(2)}>
          Two Player
        </button>
        </div>
      );
    } else {
      return (
        <div>
        <button className="btn" onClick={() =>  props.onClick(1)}>
          One Player
        </button>
        /
        <button className="btn disabled" onClick={() =>  props.onClick(2)}>
          Two Player
        </button>
        </div>
      );
    }
}
  
  class Board extends React.Component {
    renderSquare(i) {
      return ( 
        <Square 
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
        stepNumber: 0,
        xIsNext: true,
        onePlayer: true,
        AISymbol: 'O',
      }
    }

    AIFirst(){
      this.setState({
        AISymbol: 'X'
      })
    }

    otherTurn(q) {
      if(q === 3) {
        this.setState({AISymbol: 'X'});
      }
      const AISymbol = this.state.AISymbol;
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      var AIMove = computerTurn(current.squares, AISymbol);
        this.setState({
          history: history.concat([
            {
            squares: AIMove,
            }
          ]),
          stepNumber: history.length,
          xIsNext: !this.state.xIsNext
        });
    }

    refreshPage() {
      window.location.reload(false);
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if(calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([
          {
          squares: squares,
          }
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      });
    }

    playerClick(j) {
      let onePlayer = this.state.onePlayer;
      if(j === 1 && !onePlayer) {
        this.setState({
          onePlayer: true,
          history: [{
            squares: Array(9).fill(null),
          }],
          stepNumber: 0,
          xIsNext: true,
        });
      } else if (j === 2 && onePlayer) {
        this.setState({
          onePlayer: false,
          history: [{
            squares: Array(9).fill(null),
          }],
          stepNumber: 0,
          xIsNext: true,
        });
      }
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

    render() {

      if (this.state.onePlayer && this.state.xIsNext && this.state.AISymbol === 'X') {
        this.otherTurn();
      } else if(!this.state.xIsNext && this.state.AISymbol === 'O' && this.state.onePlayer){
        this.otherTurn();
      }

      const history = this.state.history;
      var current = history[this.state.stepNumber];
      // Fix bug where current.squares went undefined after a full board
      if (current.squares === undefined)
        current = history[this.state.stepNumber-1];

      const winner = calculateWinner(current.squares);

      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move :
          'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}
  </button>
          </li>
        );
      });

      let status;
      if (winner === 'TIE') {
        status = 'Draw';
      }
      else if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <h3 className="title">Tic Tac Toe</h3>
          <div className="game-board">
            <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <FirstPick
              onClick={(k) => this.AIFirst()}
              text="AI Go First"
              visible={this.state.stepNumber === 0 && this.state.onePlayer}
            />
            <FirstPick
              onClick={(k) => this.refreshPage()}
              text="Restart"
              visible={winner}
            />
            <PlayerSelect
            onClick={(j) => this.playerClick(j)}
            onePlayer={this.state.onePlayer}
            />
          </div>
        </div>
      );
    }
  }
//
// <ol>{moves}</ol>
  function calculateWinner(squares) {
    if (squares == null) {
      return 'TIE'
    }
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      try {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
      } catch(err) {
        console.log(err.message);
        console.log(a + "" + b + "" + c)
        console.log(squares);
      }
    }

    for (let i = 0; i < 9; i++) {
      if(squares[i] == null) {
        return null;
      }
    }
    return 'TIE';
  }

  function depth(s) {
    let total = 0;
    for(var i = 0; i < s.length; i++) {
      if (s[i] == null) {
        total += 1
      }
    }
    return total;
  }

  function computerTurn(board, sym) {
    var possibleMoves = checkMoves(board, sym);
    var scores = [];

    // If empty board do a random move
    if (depth(board) === 9)
      return possibleMoves[Math.floor(Math.random() * Math.floor(9))]
    
    if(sym === 'X') {
      for (let i = 0; i < possibleMoves.length; i++) {
        scores.push(minValue(possibleMoves[i], depth(possibleMoves[i])));
      }
    } else {
      for (let i = 0; i < possibleMoves.length; i++) {
        scores.push(maxValue(possibleMoves[i], depth(possibleMoves[i])));
      }
    }

    console.log(scores);

    let highscore = sym === 'X' ? -9999 : 9999;
    var indexh = 0;

    if(sym === 'X') {
    for (let i = 0; i < scores.length; i++) {
      if (scores[i] > highscore) {
        highscore = scores[i];
        indexh = i;
      }
    }
  } else {
    for (let i = 0; i < scores.length; i++) {
      if (scores[i] < highscore) {
        highscore = scores[i];
        indexh = i;
      }
    }
  }

    return possibleMoves[indexh];

  }

  // Check if board is full
  function gameover(s) {
    for(var i = 0; i < 9; i++) {
      if(s[i] == null) {
        return false;
      }
    }
    return true;
  }

  function maxValue(s, depth) {
    // If in a terminal state then return state score
    if(gameover(s) || rate(s) !== 0) {
      let score = rate(s);
      return score;
    }

    let alpha = -99999
    let succ = checkMoves(s, 'X');
    for(let i = 0; i < succ.length; i++) {
      alpha = Math.max(alpha, minValue(succ[i], depth - 1));
    }

    return alpha;
  }

  function minValue(s, depth) {
    // If in a terminal state then return state score
    if(gameover(s) || rate(s) !== 0) {
      let score = rate(s);
      return score;
    }

    let beta = 99999
    let succ = checkMoves(s, 'O');
    for(let i = 0; i < succ.length; i++) {
      beta = Math.min(beta, maxValue(succ[i], depth - 1));
    }

    return beta;
  }
  

  function rate(s) {
    var gameState = calculateWinner(s);
     if (gameState === 'X') {
      return 1;
    } else if (gameState ==='O'){
      return -1;
    } else {
      return 0;
    }
  }

  // Returns list of all possible moves
  function checkMoves(board, player) {
    var returnList = [];

    for (var i = 0; i < 9; i++) {
      var copyofboard = Array.from(board);
      if (copyofboard[i] == null) {
        copyofboard[i] = player;
        returnList.push(copyofboard);
      }
    }

    return returnList;
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  