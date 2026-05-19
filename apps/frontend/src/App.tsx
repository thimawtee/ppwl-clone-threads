import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import BerandaPage from "./pages/BerandaPage";
import HomeLoggedInPage from "./pages/HomeLoggedInPage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BerandaPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/home" element={<HomeLoggedInPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}