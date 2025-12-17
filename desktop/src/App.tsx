import "./index.css";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import SettingsPage from "./pages/Settings";
import MenuPage from "./pages/Menu";
import AuthPage from "./pages/Auth";
import { useAuthStore } from "./store/auth-store";

import "./globals.css";
import ProductPage from "./pages/Product";
function App() {
  document.body.classList.add("dark");

  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}

function AppRoutes() {
  const { token, selectedStore } = useAuthStore();

  return (
    <Routes>
      {!token ? (
        <>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </>
      ) : (
        <>
          <Route
            path="/"
            element={
              <Navigate to={`/store/${selectedStore?.store.id}`} replace />
            }
          />

          <Route path="/store/:id" element={<Layout />}>
            <Route path="menu" element={<MenuPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route
              path="/store/:id/product/:productId"
              element={<ProductPage />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </>
      )}
    </Routes>
  );
}

export default App;
