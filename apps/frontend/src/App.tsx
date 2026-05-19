import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BerandaPage from "./pages/BerandaPage";
import HomeLoggedInPage from "./pages/HomeLoggedInPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import ThreadDetailPage from "./components/threaddetail"; 
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BerandaPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomeLoggedInPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* ─── Cuma nambah 1 baris ini, tanpa ngerusak susunan aslinya 💬 ─── */}
        <Route path="/posts/:id" element={<ThreadDetailPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}