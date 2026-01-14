import { useState } from "react";
import { Link } from "react-router-dom";

import menuIcon from "../../assets/icons/menu.svg";
import styles from "./Header.module.css";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    if (window.innerWidth < 1000) {
      setIsMenuOpen((prev) => !prev);
    }
  };

  return (
    <div>
      <header className={styles["header"]}>
        <img
          src={menuIcon}
          alt="Menu"
          className={styles["menu"]}
          onClick={toggleMenu}
        />
        <nav
          className={`${styles["nav-bar"]} ${isMenuOpen ? styles["open"] : ""}`}
          onClick={toggleMenu}
        >
          <Link to="/pomodoro" className={styles["link"]}>
            Pomodoro
          </Link>
          <Link to="/todolist" className={styles["link"]}>
            Todo List
          </Link>
          <Link to="/weather" className={styles["link"]}>
            Weather
          </Link>
          <Link to="/calculator" className={styles["link"]}>
            Calculator
          </Link>
          <Link to="/passwordGenerator" className={styles["link"]}>
            Password generator
          </Link>
        </nav>
      </header>
      {isMenuOpen && (
        <div className={styles["overlay"]} onClick={toggleMenu}></div>
      )}
    </div>
  );
};
