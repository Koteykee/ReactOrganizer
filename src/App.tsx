import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import { Header } from "./components/Header/Header";
import { Welcome } from "./components/Welcome/Welcome";
import { Pomodoro } from "./components/Pomodoro/Pomodoro";
import { TodoList } from "./components/TodoList/TodoList";
import { WeatherSearch } from "./components/Weather/WeatherSearch/WeatherSearch";
import { Calculator } from "./components/Calculator/Calculator";
import { PasswordGenerator } from "./components/PasswordGenerator/PasswordGenerator";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/todolist" element={<TodoList />} />
          <Route path="/weather" element={<WeatherSearch />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/passwordGenerator" element={<PasswordGenerator />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
