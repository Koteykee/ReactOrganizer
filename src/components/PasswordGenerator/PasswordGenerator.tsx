import { useState } from "react";

import styles from "./PasswordGenerator.module.css";
import { Slider, Switch } from "@mui/material";

export const PasswordGenerator = () => {
  const [password, setPassword] = useState<string>("");
  const [copied, setCopied] = useState<string>("");
  const [passLength, setPassLength] = useState<number>(10);
  const [useUppercase, setUseUppercase] = useState<boolean>(true);
  const [useLowercase, setUseLowercase] = useState<boolean>(true);
  const [useNumbers, setUseNumbers] = useState<boolean>(true);
  const [useSymbols, setUseSymbols] = useState<boolean>(false);

  const getPassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let availableChars = "";

    if (useUppercase) availableChars += uppercase;
    if (useLowercase) availableChars += lowercase;
    if (useNumbers) availableChars += numbers;
    if (useSymbols) availableChars += symbols;

    let result = "";

    for (let i = 0; i < passLength; i++) {
      const randomIndex = Math.floor(Math.random() * availableChars.length);
      result += availableChars[randomIndex];
    }
    setPassword(result);
  };

  const copyPassword = async () => {
    if (password) {
      await navigator.clipboard.writeText(password);
    }
    setCopied(password);
  };

  return (
    <div className={styles["container"]}>
      <h3 className={styles["title"]}>Password Generator</h3>
      <div
        className={styles["password"]}
        onClick={password ? copyPassword : undefined}
      >
        <p>{password || "Click generate"}</p>
        {password !== "" && copied !== password && (
          <p className={styles["copy-hint"]}>click to copy</p>
        )}
        {password !== "" && copied === password && (
          <p className={styles["copied"]}>copied</p>
        )}
      </div>
      <p className={styles["text"]}>Length: {passLength}</p>
      <div className={styles["slider"]}>
        <Slider
          value={passLength}
          onChange={(_, newValue) => setPassLength(newValue)}
          min={4}
          max={30}
          step={1}
          valueLabelDisplay="auto"
          sx={{ color: "#10b981" }}
        />
      </div>
      <p className={styles["text"]}>Settings</p>
      <div className={styles["settings"]}>
        <div className={styles["setting"]}>
          <p>Include Uppercase</p>
          <Switch
            checked={useUppercase}
            onChange={() => setUseUppercase(!useUppercase)}
            disabled={
              !useLowercase && !useNumbers && !useSymbols && useUppercase
            }
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": { color: "#10b981" },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#10b981",
              },
              opacity:
                !useLowercase && !useNumbers && !useSymbols && useUppercase
                  ? 0.5
                  : 1,
            }}
          />
        </div>
        <div className={styles["setting"]}>
          <p>Include Lowercase</p>
          <Switch
            checked={useLowercase}
            onChange={() => setUseLowercase(!useLowercase)}
            disabled={
              !useUppercase && !useNumbers && !useSymbols && useLowercase
            }
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": { color: "#10b981" },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#10b981",
              },
              opacity:
                !useUppercase && !useNumbers && !useSymbols && useLowercase
                  ? 0.5
                  : 1,
            }}
          />
        </div>
        <div className={styles["setting"]}>
          <p>Include Numbers</p>
          <Switch
            checked={useNumbers}
            onChange={() => setUseNumbers(!useNumbers)}
            disabled={
              !useUppercase && !useLowercase && !useSymbols && useNumbers
            }
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": { color: "#10b981" },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#10b981",
              },
              opacity:
                !useUppercase && !useLowercase && !useSymbols && useNumbers
                  ? 0.5
                  : 1,
            }}
          />
        </div>
        <div className={styles["setting"]}>
          <p>Include Symbols</p>
          <Switch
            checked={useSymbols}
            onChange={() => setUseSymbols(!useSymbols)}
            disabled={
              !useUppercase && !useLowercase && !useNumbers && useSymbols
            }
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": { color: "#10b981" },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#10b981",
              },
              opacity:
                !useUppercase && !useLowercase && !useNumbers && useSymbols
                  ? 0.5
                  : 1,
            }}
          />
        </div>
      </div>
      <button onClick={getPassword} className={styles["btn"]}>
        Generate password
      </button>
    </div>
  );
};
