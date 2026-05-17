import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../services/api";
import { useAuthStore } from "../stores/authStore";

type Notification = {
  id: string;
  type: "LIKE" | "COMMENT";
  isRead: boolean;
  createdAt: string;
  actor: {
    name: string;
    username: string;
  };
  post?: {
    id: string;
    content: string;
  } | null;
};

export default function NotificationPage() {
  const token = useAuthStore((state) => state.token);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  async function getNotifications() {
    if (!token) {
      setLoading(false);
      return;
    }

    const result = await apiFetch("/notifications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (result.success) {
      setNotifications(result.data);
    }

    setLoading(false);
  }

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="sticky top-0 border-b border-zinc-800 bg-black/80 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between">
          <Link to="/" className="text-zinc-400 hover:text-white">
            ← Beranda
          </Link>
          <h1 className="font-bold">Notifications</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-3">
        {loading && <p className="text-zinc-400">Loading...</p>}

        {!loading && notifications.length === 0 && (
          <p className="text-zinc-400">Belum ada notifikasi.</p>
        )}

        {notifications.map((notif) => (
          <Link
            key={notif.id}
            to={notif.post ? `/posts/${notif.post.id}` : "/"}
            className="block border border-zinc-800 rounded-2xl p-4 hover:bg-zinc-900"
          >
            <p>
              <span className="font-semibold">{notif.actor.name}</span>{" "}
              {notif.type === "LIKE"
                ? "menyukai postinganmu."
                : "mengomentari postinganmu."}
            </p>

            {notif.post && (
              <p className="text-sm text-zinc-500 mt-2 line-clamp-2">
                {notif.post.content}
              </p>
            )}

            {!notif.isRead && (
              <span className="inline-block mt-3 text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                Baru
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}