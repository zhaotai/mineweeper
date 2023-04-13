import { useState } from "react";
import "./Emoji.css";

export type EmojiState = "success" | "failed" | "playing";

interface Props {
  state: EmojiState;
  onClick: () => void;
}

function Emoji(props: Props) {
  const [pressed, setPressed] = useState(false);
  const onMouseDown = () => {
    setPressed(true);
  };

  const onMouseUp = () => {
    setPressed(false);
  };

  let cls = "icon ";
  if (props.state === "success") {
    cls += "facewin";
  } else if (props.state === "failed") {
    cls += "cry";
  } else {
    cls += "smile";
  }
  if (pressed) {
    cls += " pressed";
  }
  return (
    <div className="emoji" onMouseDown={onMouseDown} onMouseUp={onMouseUp} onClick={props.onClick}>
      <div className={cls}></div>
    </div>
  );
}

export default Emoji;