import { useState } from "react";

import volumeIcon from "../../assets/icons/volume.svg";
import styles from "./Pomodoro.module.css";

export const Pomodoro = () => {
  const [workTimer, setWorkTimer] = useState(20);
  const [breakTimer, setBreakTimer] = useState(5);
  const [activeTimer, setActiveTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [volume, setVolume] = useState(30);
  const [alarm, setAlarm] = useState(null);

  const focusTimer = (active) => {
    if (activeTimer === active) {
      stopTimer();
      setActiveTimer(null);
      return;
    }
    if (activeTimer === null) {
      setActiveTimer(active);
      activeTimer === "work" ? timer(workTimer) : timer(breakTimer);
    }
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

  let timerInterval = null;

  const timer = (time) => {
    setTimeLeft(time * 60);

    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft((prev) => prev - 1);
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        playAudio();
        if (activeTimer === "work") {
          setActiveTimer("break");
          timer(breakTimer);
        } else {
          setActiveTimer("work");
          timer(workTimer);
        }
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  };

  const formattedTime = computed(() => {
    const min = Math.floor(timeLeft / 60)
      .toString()
      .padStart(2, "0");
    const sec = (timeLeft % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  });

  const playAudio = () => {
    if (alarm) {
      alarm.volume = volume / 100;
      alarm
        .play()
        .catch((error) => console.error("Ошибка воспроизведения:", error));
    }
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["wrapper"]}>
        <div
          className={styles["volume-wrapper"]}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {/* <Slider
          v-model.number="volume"
          :min="0"
          :max="100"
          :tooltips="false"
          orientation="vertical"
          direction="rtl"
          class="slider"
        /> */}
          <img src={volumeIcon} alt="Volume" className={styles["volume"]} />
        </div>
        <div
          onMouseDown={focusTimer("work")}
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
            {activeTimer === "work" ? formattedTime : workTimer}
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
          onClick={focusTimer("break")}
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
            {activeTimer === "break" ? formattedTime : breakTimer}
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
        ref="alarm"
        className={styles["alarm"]}
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/41203/beep.mp3"
      ></audio>
    </div>
  );
};
