import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import "./Board.css";
import { expand, generateBoard, generateFlipBoard, generateMines, getClassNames, isSuccess, showAllMines } from "./utils";

interface Props {
  rows: number;
  cols: number;
  mines: number;
  onFlagChange: (flags: number) => void;
  onSuccess: () => void;
  onFail: () => void; 
  onStart: () => void;
}

export interface BoardRef {
  reset: () => void;
}


export enum FlipState {
  Hide = "hide",
  Open = "open",
  Flag = "flag",
  BombDeath = "bombdeath"
}

export const CELL_WIDTH = 16;

const Board = forwardRef<BoardRef, Props>(({ rows, cols, mines, onFail, onSuccess, onFlagChange, onStart }, ref) => {
  const [fistClick, setFirstClick] = useState(false);
  const [active, setActive] = useState(true);
  const [flags, setFlags] = useState(mines);
  const [board, setBoard] = useState<string[][]>([]);
  const [flipBoard, setFlipBoard] = useState<FlipState[][]>([]);

  useEffect(() => {
    setFirstClick(false);
    setActive(true);
    setFlags(mines);
    setBoard(generateBoard(rows, cols, mines));
    setFlipBoard(generateFlipBoard(rows, cols));
  }, [rows, cols, mines]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setFirstClick(false);
      setActive(true);
      setFlags(mines);
      setBoard(generateBoard(rows, cols, mines));
      setFlipBoard(generateFlipBoard(rows, cols));
    }
  }));

  const gameOver = () => {
    setActive(false);
    onFail();
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement>, i: number, j: number) => {
    if (!active) return;
    if (!fistClick) {
      setFirstClick(true);

      // i, j shouldn't be bomb
      generateMines(board, mines, i, j);
      onStart();
    }
    // 0 left click, 1 right click
    if (e.button === 0) {
      if (flipBoard[i][j] === FlipState.Flag) {
        return;
      } else if (board[i][j] === "") {
        expand(board, flipBoard, i, j);
        setBoard([...board]);
      } else if (board[i][j] === "x") {
        // game over
        flipBoard[i][j] = FlipState.BombDeath;
        showAllMines(board, flipBoard);
        gameOver();
      } else {
        flipBoard[i][j] = FlipState.Open;
      }
      setFlipBoard([...flipBoard]);
    } else if (e.button === 2) {
      if (flipBoard[i][j] === FlipState.Flag) {
        onFlagChange(flags + 1);
        setFlags(flags => flags + 1);
        flipBoard[i][j] = FlipState.Hide;
      } else if (flipBoard[i][j] === FlipState.Hide) {
        onFlagChange(flags - 1);
        setFlags(flags => flags - 1);
        flipBoard[i][j] = FlipState.Flag;
      }
      setFlipBoard([...flipBoard]);
    }
    
    if (isSuccess(board, flipBoard, mines)) {
      onSuccess();
      setActive(false);
    }
  }

  return (
    <div className="board" style={{ width: cols * CELL_WIDTH }}>
      {renderBoard(board, flipBoard, onClick)}
    </div>
  );
});

function renderBoard(
  board: string[][],
  flipBoard: FlipState[][],
  onClick: (e: React.MouseEvent<HTMLDivElement>, i: number, j: number) => void
): JSX.Element {
  if (board.length === 0) return <></>;
  const rows = board.length;
  const cols = board[0].length;
  const res = [];
  for (let i = 0; i < rows; i ++) {
    for (let j = 0; j < cols; j ++) {
      let cls = getClassNames(board[i][j], flipBoard[i][j]);
      const cell = <div key={`${i * cols + j}`} className={cls} onContextMenu={(e) => onClick(e, i, j)} onClick={(e) => onClick(e, i, j)}></div>
      res.push(cell);
    }
  }
  return <>{res}</>;
}



export default Board;