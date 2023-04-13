import { useState } from "react";
import { Settings } from "../../models";
import "./Menu.css";

interface Props {
  onSettingsChange: (settings: Settings) => void;
}

function Menu({ onSettingsChange }: Props) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [rows, setRows] = useState("");
  const [cols, setCols] = useState("");
  const [mines, setMines] = useState("");
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const openSettings = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsPopupOpen(true);
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setPopupPosition({ top: buttonRect.bottom, left: 0 });
  };

  const closeSettings = () => {
    setIsPopupOpen(false);
  };

  const newGame = () => {
    const rowsNum = Number.parseInt(rows);
    const colsNum = Number.parseInt(cols);
    const minesNum = Number.parseInt(mines);
    let needReset = false;
    if (isNaN(rowsNum) || isNaN(colsNum) || isNaN(minesNum)) {
      needReset = true;
    } else if (minesNum > 999 || rowsNum <= 0 || colsNum <= 0 || minesNum <= 0) {
      needReset = true;
    } else if (rowsNum * colsNum < minesNum) {
      needReset = true;
    }

    if (needReset) {
      setRows("9");
      setCols("9");
      setMines("10");
      return;
    }

    onSettingsChange({
      rows: rowsNum,
      cols: colsNum,
      mines: minesNum
    });
    setIsPopupOpen(false);
  }

  return (
    <div className="menu">
      <button onClick={openSettings}>Game</button>
      {isPopupOpen && (
        <div className="popup" style={{ top: popupPosition.top, left: popupPosition.left }}>
          <div className="close" onClick={closeSettings}>X</div>
          <div>
            <div className="header">
              <div className="rows">rows</div>
              <div className="cols">cols</div>
              <div className="mines">mines</div>
            </div>
            <div className="body">
              <label className="label">Custom</label>
              <input type="text" value={rows} onChange={(e) => setRows(e.target.value)} />
              <input type="text" value={cols} onChange={(e) => setCols(e.target.value)} />
              <input type="text" value={mines} onChange={(e) => setMines(e.target.value)} />
            </div>
            <div className="footer">
              <button type="button" onClick={newGame}>New Game</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Menu;