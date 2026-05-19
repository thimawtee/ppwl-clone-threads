import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BerandaPage from "./pages/BerandaPage";
import HomeLoggedInPage from "./pages/HomeLoggedInPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BerandaPage />} />
        <Route path="/home" element={<HomeLoggedInPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}