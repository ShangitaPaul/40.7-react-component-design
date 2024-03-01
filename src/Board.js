import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows=5, ncols=5 chanceLightStartsOn=0.25 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    return Array.from({ length: nrows }, () =>
      Array.from({ length: ncols }, () => Math.random() < chanceLightStartsOn)
    );
  }
  // TODO: check the board in state to determine whether the player has won.
  function hasWon() {
    return board.every(row => row.every(cell => !cell));
  }
  // Flip cells around
  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      // If the board is won, just return the old board
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      const boardCopy = oldBoard.map(row => [...row]);
      flipCell(y, x, boardCopy);//flip initial cell
      flipCell(y, x - 1, boardCopy);//flip left cell
      flipCell(y, x + 1, boardCopy);//flip right cell
      flipCell(y - 1, x, boardCopy);//flip cell above
      flipCell(y + 1, x, boardCopy);//flip cell below
      return boardCopy;
    }
    );
  }

  // if the game is won, just show a winning msg & render nothing else
  if (hasWon()) {
    return <div>You won!</div>;
  }

  // make table board
  const tableBoard = Array.from({ length: nrows }, (row, y) => (
    <tr key={y}>
      {Array.from({ length: ncols }, (cell, x) => (
        <Cell
          key={`${y}-${x}`}
          isLit={board[y][x]}
          flipCellsAroundMe={() => flipCellsAround(`${y}-${x}`)}
        />
      ))}
    </tr>
  ));
  return (
    <table className="board">
      <tbody>{tableBoard}</tbody>
    </table>
  );
/* OR 
for (let y = 0; y < nrows; y++) {
  let row = [];
  for (let x = 0; x < ncols; x++) {
    let coord = `${y}-${x}`;
    row.push(
      <Cell
        key={coord}
        isLit={board[y][x]}
        flipCellsAroundMe={() => flipCellsAround(coord)}
      />
    );
  }
  */
  //tableBoard.push(<tr key={y}>{row}</tr>);
}
// Export the Board component
export default Board;
