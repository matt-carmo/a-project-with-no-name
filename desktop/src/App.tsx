import "./index.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import SettingsPage from "./pages/Settings";

function App() {
  document.body.classList.add("dark");

  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<h1>Página inicial</h1>} />
          <Route path='settings' element={<SettingsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
