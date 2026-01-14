import { useRef, useState } from "react";

import styles from "./Calculator.module.css";

export const Calculator = () => {
  const [answer, setAnswer] = useState<string>("");
  const [history, setHistory] = useState<string>("");
  const justCalculated = useRef<boolean>(false);
  const operators = ["+", "-", "x", "÷"];

  function append(value: string) {
    if (answer === "Error") {
      if (/^\d$/.test(value) || value === ".") {
        setAnswer(value === "." ? "0." : value);
        justCalculated.current = false;
      }
      return;
    }

    if (justCalculated.current) {
      if (!operators.includes(value)) {
        setAnswer(value);
      } else {
        setHistory(
          (prev) => prev + answer + value.replace("x", "*").replace("÷", "/")
        );
        setAnswer("");
      }
      justCalculated.current = false;
      return;
    }

    const operator = value.replace("x", "*").replace("÷", "/");

    if (operators.includes(value)) {
      if (answer === "" && history === "") {
        if (value === "-") {
          setAnswer("-");
        } else {
          setHistory("0" + operator);
        }
        return;
      }

      if (answer === "-" && history === "") {
        setHistory("0" + operator);
        setAnswer("");
        return;
      }

      if (answer !== "") {
        setHistory((prev) => prev + answer + operator);
        setAnswer("");
      } else {
        setHistory((prev) => {
          const lastChar = prev.slice(-1);
          return operators.includes(lastChar)
            ? prev.slice(0, -1) + operator
            : prev;
        });
      }
      return;
    }

    if (/^\d$/.test(value)) {
      setAnswer((prev) => {
        if (prev === "0") return value;
        return prev + value;
      });
      return;
    }

    if (value === ".") {
      setAnswer((prev) => {
        if (!prev) return "0.";
        if (prev.includes(".")) return prev;
        return prev + ".";
      });
    }
  }

  function applyFunction(fn: "square" | "sqrt" | "inv") {
    if (answer === "Error") return;
    const num = parseFloat(answer);
    if (isNaN(num)) return;

    try {
      if (fn === "square") {
        setAnswer(String(roundTo(num ** 2, 12)));
      }
      if (fn === "sqrt") {
        if (num < 0) {
          setAnswer("Error");
          return;
        }
        setAnswer(String(roundTo(Math.sqrt(num), 12)));
      }
      if (fn === "inv") {
        if (num === 0) {
          setAnswer("Error");
          return;
        }
        setAnswer(String(roundTo(1 / num, 12)));
      }

      justCalculated.current = true;
    } catch {
      setAnswer("Error");
    }
  }

  function clear() {
    setAnswer("");
    setHistory("");
    justCalculated.current = false;
  }

  function backspace() {
    justCalculated.current = false;

    if (answer.length > 0) {
      setAnswer((prev) => prev.slice(0, -1));
    } else if (history.length > 0) {
      setHistory((prev) => {
        const match = prev.match(/([\d.]+|\*|\/|\+|-)+$/);
        if (match) {
          return prev.slice(0, -match[0].length);
        }
        return prev.slice(0, -1);
      });
    }
  }

  function calculate() {
    if (answer === "Error") return;
    try {
      let expr = history + answer;

      if (!answer && history) {
        const lastChar = history.slice(-1);
        if ("+-*/".includes(lastChar)) {
          const lastNumberMatch = history.match(/(\d+\.?\d*)[^0-9]*$/);
          if (lastNumberMatch) {
            expr += lastNumberMatch[1];
          } else {
            setAnswer("Error");
            setHistory("");
            return;
          }
        }
      }

      expr = expr.replace(/x/g, "*").replace(/÷/g, "/");
      if (expr === "") return;

      const result = Function(`"use strict"; return (${expr})`)();

      if (!isFinite(result)) {
        setAnswer("Error");
        setHistory("");
        return;
      }

      setAnswer(String(roundTo(result, 12)));
      setHistory("");
      justCalculated.current = true;
    } catch {
      setAnswer("Error");
      setHistory("");
    }
  }

  function roundTo(num: number, digits: number): number {
    const factor = 10 ** digits;
    return Math.round(num * factor) / factor;
  }

  return (
    <div className={styles["container"]}>
      <div className={styles["display"]}>
        <input
          type="text"
          className={styles["history"]}
          value={history}
          readOnly
        />
        <input
          type="text"
          className={styles["current"]}
          placeholder="0"
          value={answer}
          readOnly
        />
      </div>

      <div className={styles["buttons"]}>
        <div className={styles["empty-slot"]}></div>
        <div className={styles["empty-slot"]}></div>
        <div className={styles["empty-slot"]}></div>
        <button onClick={backspace}>⌫</button>

        <button onClick={() => applyFunction("inv")}>1/x</button>
        <button onClick={() => applyFunction("square")}>x²</button>
        <button onClick={() => applyFunction("sqrt")}>√x</button>
        <button onClick={() => append("÷")}>÷</button>

        <button onClick={() => append("7")}>7</button>
        <button onClick={() => append("8")}>8</button>
        <button onClick={() => append("9")}>9</button>
        <button onClick={() => append("x")}>x</button>

        <button onClick={() => append("4")}>4</button>
        <button onClick={() => append("5")}>5</button>
        <button onClick={() => append("6")}>6</button>
        <button onClick={() => append("-")}>-</button>

        <button onClick={() => append("1")}>1</button>
        <button onClick={() => append("2")}>2</button>
        <button onClick={() => append("3")}>3</button>
        <button onClick={() => append("+")}>+</button>

        <button onClick={clear}>C</button>
        <button onClick={() => append("0")}>0</button>
        <button onClick={() => append(".")}>.</button>
        <button onClick={calculate}>=</button>
      </div>
    </div>
  );
};
