import { useEffect } from "react";
import { toast } from "sonner";
import { useAuthStore } from "../stores/auth.store";
import { API_URL } from "@/services/api";

export default function NotificationSystem() {
  const currentUser = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!currentUser) return;

    const ws = new WebSocket(
      `ws:${API_URL}/ws/notifications?userId=${currentUser.id}`
    );

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "LIKE") {
          toast.success("❤️ Seseorang menyukai postingan Anda!");
        } else if (data.type === "COMMENT") {
          toast.success("💬 Seseorang mengomentari postingan Anda!");
        } else {
          toast.success("🔔 Notifikasi baru");
        }
      } catch (error) {
        console.error("Gagal membaca notifikasi:", error);
      }
    };

    ws.onerror = () => {
      console.error("WebSocket error");
    };

    return () => {
      ws.close();
    };
  }, [currentUser]);

  return null;
}