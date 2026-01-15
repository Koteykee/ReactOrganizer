import { useEffect, useRef, useState } from "react";

import volumeIcon from "../../assets/icons/volume.svg";
import styles from "./Pomodoro.module.css";
import { Slider } from "@mui/material";

export const Pomodoro = () => {
  const [workTimer, setWorkTimer] = useState<number>(20);
  const [breakTimer, setBreakTimer] = useState<number>(5);
  const [activeTimer, setActiveTimer] = useState<"work" | "break" | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [volume, setVolume] = useState<number>(30);

  const alarmRef = useRef<HTMLAudioElement | null>(null);

  const focusTimer = (active: "work" | "break") => {
    if (activeTimer === active) {
      setActiveTimer(null);
      setTimeLeft(0);
      return;
    }
    setTimeLeft((active === "work" ? workTimer : breakTimer) * 60);
    setActiveTimer(active);
  };

  const workTimerInc = () => {
    setWorkTimer((prev) => prev + 1);
  };

  const workTimerDec = () => {
    if (workTimer < 2) return;
    setWorkTimer((prev) => prev - 1);
  };

  const breakTimerInc = () => {
    setBreakTimer((prev) => prev + 1);
  };

  const breakTimerDec = () => {
    if (breakTimer < 2) return;
    setBreakTimer((prev) => prev - 1);
  };

  const formattedTime = () => {
    const min = Math.floor(timeLeft / 60)
      .toString()
      .padStart(2, "0");
    const sec = (timeLeft % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  const playAudio = () => {
    if (alarmRef.current) {
      alarmRef.current.volume = volume / 100;
      alarmRef.current
        .play()
        .catch((error) => console.error("Ошибка воспроизведения:", error));
    }
  };

  useEffect(() => {
    if (!activeTimer) return;

    if (timeLeft === 0) {
      const switchTimeout = setTimeout(() => {
        const nextMode = activeTimer === "work" ? "break" : "work";
        const nextTime = nextMode === "work" ? workTimer : breakTimer;

        setActiveTimer(nextMode);
        setTimeLeft(nextTime * 60);
        playAudio();
      }, 0);

      return () => clearTimeout(switchTimeout);
    }

    const timeout = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [timeLeft, activeTimer, workTimer, breakTimer]);

  return (
    <div className={styles["container"]}>
      <div className={styles["wrapper"]}>
        <div
          className={styles["volume-wrapper"]}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className={styles["slider"]}>
            <Slider
              value={volume}
              onChange={(_, newValue) => setVolume(newValue)}
              min={0}
              max={100}
              step={1}
              orientation="vertical"
              sx={{ color: "#10b981", height: 150 }}
            />
          </div>
          <img src={volumeIcon} alt="Volume" className={styles["volume"]} />
        </div>
        <div
          onClick={() => focusTimer("work")}
          className={`${styles["work"]} ${
            activeTimer === "work" ? styles["active"] : ""
          } ${activeTimer === "break" ? styles["inactive"] : ""}`}
        >
          <p
            className={`${styles["text"]} ${
              activeTimer === "work" ? styles["activeTitle"] : ""
            }`}
          >
            Work
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              workTimerInc();
            }}
            className={`${styles["btn"]} ${
              activeTimer !== null ? styles["hidden"] : ""
            }`}
          >
            ⏶
          </button>
          <div className={`${activeTimer !== null ? styles["timer"] : ""}`}>
            {activeTimer === "work" ? formattedTime() : workTimer}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              workTimerDec();
            }}
            className={`${styles["btn"]} ${
              activeTimer !== null ? styles["hidden"] : ""
            }`}
          >
            ⏷
          </button>
        </div>
        <div
          onClick={() => focusTimer("break")}
          className={`${styles["break"]} ${
            activeTimer === "break" ? styles["active"] : ""
          } ${activeTimer === "work" ? styles["inactive"] : ""}`}
        >
          <p
            className={`${styles["text"]} ${
              activeTimer === "break" ? styles["activeTitle"] : ""
            }`}
          >
            Break
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              breakTimerInc();
            }}
            className={`${styles["btn"]} ${
              activeTimer !== null ? styles["hidden"] : ""
            }`}
          >
            ⏶
          </button>
          <div className={`${activeTimer !== null ? styles["timer"] : ""}`}>
            {activeTimer === "break" ? formattedTime() : breakTimer}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              breakTimerDec();
            }}
            className={`${styles["btn"]} ${
              activeTimer !== null ? styles["hidden"] : ""
            }`}
          >
            ⏷
          </button>
        </div>
      </div>
      <audio
        ref={alarmRef}
        className={styles["alarm"]}
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/41203/beep.mp3"
      ></audio>
    </div>
  );
};
