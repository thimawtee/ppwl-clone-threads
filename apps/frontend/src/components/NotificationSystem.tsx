import { useEffect } from "react";
import { toast } from "sonner";
import { useAuthStore } from "../stores/auth.store";

export default function NotificationSystem() {
  const currentUser = useAuthStore((state) => state.user);

  useEffect(() => {
    // Jangan connect kalau belum login
    if (!currentUser) return;

    const ws = new WebSocket(
      `ws://localhost:3001/ws/notifications?userId=${currentUser.id}`
    );

    ws.onopen = () => {
      console.log("WS CONNECTED");

      toast.success("🔔 WebSocket Connected");
    };

    ws.onmessage = (event) => {
      console.log("MESSAGE:", event.data);

      try {
        const data = JSON.parse(event.data);

        let message = "📢 Notifikasi baru";

        if (data.type === "LIKE") {
          message = "❤️ Seseorang menyukai postingan Anda!";
        }

        if (data.type === "COMMENT") {
          message = "💬 Seseorang mengomentari postingan Anda!";
        }

        toast.success(message);
      } catch (error) {
        console.error("JSON ERROR:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WS ERROR:", error);
    };

    ws.onclose = () => {
      console.log("WS CLOSED");
    };

    return () => {
      ws.close();
    };
  }, [currentUser]);

  return null;
}