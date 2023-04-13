import { FlipState } from "./Board";

export function getClassNames(cell: string, flipCell: FlipState): string {
  let str = "cell ";
  if (flipCell === FlipState.Hide || flipCell === FlipState.Flag || flipCell === FlipState.BombDeath) {
    return str + flipCell;
  } else if (cell === ""){
    return str + flipCell;
  } else {
    return str + `d${cell}`;
  }
}

export function generateFlipBoard(rows: number, cols: number): FlipState[][] {
  const board = new Array(rows);
  for (let i = 0; i < board.length; i ++) {
    board[i] = new Array(cols).fill(FlipState.Hide);
  }
  return board;
}

export function generateBoard(rows: number, cols: number, mines: number): string[][] {
  const board = new Array(rows);
  for (let i = 0; i < board.length; i ++) {
    board[i] = new Array(cols).fill("");
  }
  return board;
}

export function generateMines(board: string[][], mines: number, i: number, j: number) {
  placeMinesRandomly(board, mines, i, j);
  countAdjacentMines(board);
}

export function expand(board: string[][], flipBoard: FlipState[][], i: number, j: number): void {
  if (flipBoard[i][j] !== FlipState.Hide) return;
  if (board[i][j] !== "") return;

  // bfs
  const visited = new Array(board.length);
  for (let i = 0; i < board.length; i ++) {
    visited[i] = new Array(board[0].length).fill(false);
  }
  let queue: [number, number][] = [[i, j]];
  const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  flipBoard[i][j] = FlipState.Open;
  visited[i][j] = true;
  while (queue.length !== 0) {
    const tmp: [number, number][] = [];
    while (queue.length !== 0) {
      const [row, col] = queue.pop()!;

      // if it's a number, don't expand more.
      if (board[row][col] !== "x" && board[row][col] !== "") continue;

      // go next 8 neighbors
      for (let dir of dirs) {
        const newRow = row + dir[0];
        const newCol = col + dir[1];
        if (newRow < 0 || newCol < 0 || newRow >= board.length || newCol >= board[0].length) continue;
        if (visited[newRow][newCol]) continue;
        if (board[newRow][newCol] !== "x") {
          tmp.push([newRow, newCol]);
          visited[newRow][newCol] = true;
        }
        if (flipBoard[newRow][newCol] !== FlipState.Flag) {
          flipBoard[newRow][newCol] = FlipState.Open;
        }
      }
    }
    queue = tmp;
  }
}

export function showAllMines(board: string[][], flipBoard: FlipState[][]): void {
  for (let i = 0; i < board.length; i ++) {
    for (let j = 0; j < board[0].length; j ++) {
      if (board[i][j] === "x" && flipBoard[i][j] !== FlipState.BombDeath) {
        flipBoard[i][j] = FlipState.Open;
      }
    }
  }
} 

export function isSuccess(board: string[][], flipBoard: FlipState[][], mines: number): boolean {
  for (let i = 0; i < board.length; i ++) {
    for (let j = 0; j < board[0].length; j ++) {
      if (flipBoard[i][j] === FlipState.Flag && board[i][j] !== "x") return false;
      if (flipBoard[i][j] === FlipState.Flag && board[i][j] === "x") {
        mines --;
      }
    }
  }
  return mines == 0;
}

// shuffle the list of indices and fill top mines. 
function placeMinesRandomly(board: string[][], mines: number, uRow: number, uCol: number): void {
  const indices = [];
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      if (row === uRow && col === uCol) {
        continue;
      }
      indices.push([row, col]);
    }
  }

  // shuffle the list of indices randomly
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  // place the first mines indices as mines on the board
  for (let i = 0; i < mines; i++) {
    const [row, col] = indices[i];
    board[row][col] = "x";
  }
}

function countAdjacentMines(board: string[][]): void {
  const rows = board.length;
  const cols = board[0].length;

  // count the number of adjacent mines for each non-mine square
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (board[row][col] !== "x") {
        let adjacentMines = 0;

        // check each adjacent square for a mine
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (row + i >= 0 && row + i < rows && col + j >= 0 && col + j < cols) {
              if (board[row + i][col + j] === "x") {
                adjacentMines ++;
              }
            }
          }
        }

        // set the square to the number of adjacent mines
        board[row][col] = adjacentMines === 0 ? "" : adjacentMines.toString();
      }
    }
  }
}