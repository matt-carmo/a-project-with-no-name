import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";


function App() {
  document.body.classList.add("dark");

  return (
    <HashRouter>
      <Routes>
        <Route
          path='/'
          element={<>...</>}
          children={<Route index element={<div>Home</div>} />}
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
