import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BerandaPage from "./pages/BerandaPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BerandaPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}