import { useEffect, useState } from "react";

import circleIcon from "../../assets/icons/circle.svg";
import deleteIcon from "../../assets/icons/delete.svg";
import styles from "./TodoList.module.css";

type Task = {
  id: number;
  content: string;
  isDone: boolean;
};

type Filter = "all" | "active" | "completed";

export const TodoList = () => {
  const [task, setTask] = useState<{ content: string }>({ content: "" });
  const [taskList, setTaskList] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [activeBtn, setActiveBtn] = useState<Filter>("all");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(taskList));
  }, [taskList]);

  const addTask = () => {
    if (task.content.trim() === "") return;

    setTaskList((prev) => [
      ...prev,
      {
        id: Date.now(),
        content: task.content.trim(),
        isDone: false,
      },
    ]);

    setTask({ content: "" });
  };

  const deleteTask = (id: number) => {
    setTaskList((prev) => prev.filter((task) => task.id !== id));
  };

  const filtered = () => {
    const list = taskList;

    if (activeBtn === "completed") {
      return list.filter((task) => task.isDone);
    }

    if (activeBtn === "active") {
      return list.filter((task) => !task.isDone);
    }

    return [...list].sort((a, b) => {
      if (a.isDone === b.isDone) return 0;
      return a.isDone ? 1 : -1;
    });
  };

  const filteredList = filtered();

  const showCompleted = () => {
    setActiveBtn("completed");
  };

  const showActive = () => {
    setActiveBtn("active");
  };

  const showAll = () => {
    setActiveBtn("all");
  };

  return (
    <div className={styles["todo-container"]}>
      <h2>Todo List</h2>
      <div className={styles["todo-field"]}>
        <input
          type="text"
          value={task.content}
          onChange={(e) => setTask({ content: e.target.value })}
          maxLength={50}
          className={styles["input"]}
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul>
        {filteredList.map((taskItem) => (
          <li key={taskItem.id}>
            <div className={styles["text-container"]}>
              <img src={circleIcon} alt="*" />
              <input
                type="checkbox"
                checked={taskItem.isDone}
                onChange={() =>
                  setTaskList((prev) =>
                    prev.map((task) =>
                      task.id === taskItem.id
                        ? { ...task, isDone: !task.isDone }
                        : task
                    )
                  )
                }
                className={styles["checkbox"]}
              />
              <p className={`${taskItem.isDone ? styles["done"] : ""}`}>
                {taskItem.content}
              </p>
            </div>
            <button onClick={() => deleteTask(taskItem.id)}>
              <img src={deleteIcon} alt="Delete" />
            </button>
          </li>
        ))}
      </ul>
      {taskList.length === 0 && <p>You don't have any tasks yet</p>}
      {activeBtn === "completed" &&
        filteredList.length === 0 &&
        taskList.length !== 0 && <p>You don't have any completed tasks yet</p>}
      {activeBtn === "active" &&
        filteredList.length === 0 &&
        taskList.length !== 0 && <p>You don't have any active tasks yet</p>}
      {taskList.length > 0 && (
        <div className={styles["btns"]}>
          {(activeBtn === "all" || activeBtn === "active") && (
            <button onClick={showCompleted}>Show completed tasks</button>
          )}
          {activeBtn === "completed" && (
            <button onClick={showActive}>Show active tasks</button>
          )}
          <button onClick={showAll}>Show all tasks</button>
        </div>
      )}
    </div>
  );
};
