import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import BerandaPage from "./pages/BerandaPage";
import NotificationPage from "./pages/NotificationPage";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        theme="dark"
        position="top-center"
        richColors
        toastOptions={{
          style: {
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            color: "#fff",
            borderRadius: "16px",
            fontFamily: "'Inter Variable', sans-serif",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<BerandaPage />} />
        <Route path="/activity" element={<NotificationPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}