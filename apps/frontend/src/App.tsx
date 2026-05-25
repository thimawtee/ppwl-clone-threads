import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotificationPage from "./pages/NotificationPage";
import BerandaPage from "./pages/BerandaPage";
import HomeLoggedInPage from "./pages/HomeLoggedInPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DetailPostPage from "./pages/DetailPostPage";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from "sonner";
import NotificationSystem from "./components/NotificationSystem";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <NotificationSystem />
      <Routes>
        <Route path="/" element={<BerandaPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomeLoggedInPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />

        <Route path="/activity" element={<NotificationPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/post/:id" element={<DetailPostPage />} />

        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  )
}