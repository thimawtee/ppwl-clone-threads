
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import BerandaPage from "./pages/BerandaPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import HomeLoggedInPage from "./pages/HomeLoggedInPage";
import ProfilePage from "./pages/ProfilePage";
import ThreadDetailPage from "./components/threaddetail"; 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BerandaPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomeLoggedInPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/posts/:id" element={<ThreadDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}