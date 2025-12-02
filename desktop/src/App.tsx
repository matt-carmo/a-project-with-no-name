import "./index.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import SettingsPage from "./pages/Settings";
import MenuPage from "./pages/Menu";
import AuthPage from "./pages/Auth";

function App() {
  document.body.classList.add("dark");
  //navigate to auth

  return (
    <HashRouter>
      <Routes>
        <Route path='/auth' element={<AuthPage />} />
        
        <Route path='/' element={<Layout />}>
          <Route index element={<h1>Página inicial</h1>} />
          <Route path='menu' element={<MenuPage />} />
          <Route path='settings' element={<SettingsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
