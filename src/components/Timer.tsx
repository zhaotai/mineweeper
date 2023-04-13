import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import Counter from "./counter/Counter";

export interface TimerRef {
  reset: () => void;
  stop: () => void;
  start: () => void;
}

const Timer = forwardRef<TimerRef>((_, ref) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timer;

    if (isActive) {
      intervalId = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isActive]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setSeconds(0);
      setIsActive(false);
    },
    stop: () => {
      setIsActive(false);
    },
    start: () => {
      setIsActive(true);
    }
  }));
  return (
    <div className="timer">
      <Counter num={seconds} />
    </div>
  );
})

export default Timer;