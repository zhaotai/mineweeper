import { useEffect, useRef, useState } from 'react';
import './App.css';
import Menu from './components/menu/Menu';
import FlagCounter from './components/FlagCounter';
import Emoji, { EmojiState } from './components/emoji/Emoji';
import Timer, { TimerRef } from './components/Timer';
import Board, { BoardRef, CELL_WIDTH } from './components/board/Board';
import { Settings } from './models';

function App() {
  const timerRef = useRef<TimerRef>(null);
  const boardRef = useRef<BoardRef>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<Settings>({ rows: 9, cols: 9, mines: 10 });
  const [flags, setFlags] = useState(settings.mines);
  const [gameState, setGameState] = useState<EmojiState>("playing");
  const { rows, cols, mines } = settings;

  useEffect(() => {
    const preventMenu = (e: Event) => {
      e.preventDefault();
      return false; 
    }
    appRef.current?.addEventListener("contextmenu", preventMenu, false);
    return () => {
      appRef.current?.removeEventListener("contextmenu", preventMenu);
    }
  }, [appRef]);

  useEffect(() => {
    reset();
  }, [settings]);

  const onFail = () => {
    timerRef.current?.stop();
    setGameState("failed");
  };

  const onSuccess = () => {
    timerRef.current?.stop();
    setGameState("success");
  };

  const onStart = () => {
    timerRef.current?.start();
  };

  const reset = () => {
    boardRef.current?.reset();
    timerRef.current?.reset();
    setGameState("playing");
    setFlags(mines);
  };

  return (
    <div className="app" ref={appRef}>
      <Menu onSettingsChange={(settings) => setSettings(settings)}></Menu>
      <div className="game" style={{ width: CELL_WIDTH * cols }}>
        <header className="header">
          <FlagCounter flagCount={flags} />
          <Emoji state={gameState} onClick={reset} />
          <Timer ref={timerRef} />
        </header>
        <div>
          <Board
            ref={boardRef}
            rows={rows}
            cols={cols}
            mines={mines}
            onFlagChange={(flags) => setFlags(flags)}
            onFail={onFail}
            onSuccess={onSuccess}
            onStart={onStart}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
