import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { API_URL } from "../services/api";
import { useAuthStore } from "../stores/auth.store";
import LoggedInSidebar from "../components/loggedin/LoggedInSidebar";
import FloatingCreateButton from "@/components/loggedin/FloatingCreateButton";
import CreatePostModal from "@/components/CreatePostModal";

interface NotifActor {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
}
interface NotifPost {
  id: string;
  content: string;
}
interface Notification {
  id: string;
  type: "LIKE" | "COMMENT";
  userId: string;
  actorId: string;
  isRead: boolean;
  createdAt: string;
  actor: NotifActor;
  post: NotifPost | null;
}

function timeAgo(d: string): string {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

function getInitials(n: string) {
  return n
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function Avatar({
  user,
  size = 36,
}: {
  user: { id: string; name: string; avatarUrl: string | null };
  size?: number;
}) {
  const colors = [
    "bg-violet-600",
    "bg-blue-600",
    "bg-emerald-600",
    "bg-amber-600",
    "bg-rose-600",
  ];
  const c = colors[user.id.charCodeAt(0) % colors.length];
  return (
    <div
      className="relative flex-shrink-0 rounded-full overflow-hidden"
      style={{ width: size, height: size }}
    >
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className={`w-full h-full ${c} flex items-center justify-center text-white font-semibold`}
          style={{ fontSize: size * 0.36 }}
        >
          {getInitials(user.name)}
        </div>
      )}
    </div>
  );
}

function NotifItem({
  notif,
  onOpenPost,
}: {
  notif: Notification;
  onOpenPost: (postId: string) => void;
}) {
  const icons = {
    LIKE: <Heart size={12} className="fill-rose-500 text-rose-500" />,
    COMMENT: <MessageCircle size={12} className="text-blue-400" />,
  };

  const texts = {
    LIKE: "liked your thread",
    COMMENT: "replied to your thread",
  };

  return (
    <div
      onClick={() => {
        if (notif.post?.id) {
          onOpenPost(notif.post.id);
        }
      }}
      className={`flex items-start gap-3 px-6 py-4 border-b border-[#1e1e1e] hover:bg-[#0d0d0d] transition-colors cursor-pointer ${
        !notif.isRead ? "bg-[#0a0a0a]" : ""
      }`}
    >
      <div className="relative flex-shrink-0">
        <Avatar user={notif.actor} size={40} />

        <div className="absolute -bottom-1 -right-1 bg-[#000] rounded-full p-0.5">
          <div className="bg-[#1a1a1a] rounded-full p-1">
            {icons[notif.type]}
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[15px] text-white">
            {notif.actor.username}
          </span>

          <span className="text-[#555] text-sm">
            {timeAgo(notif.createdAt)}
          </span>
        </div>

        <p className="text-[#777] text-[14px] mt-0.5">{texts[notif.type]}</p>

        {notif.post && (
          <p className="text-[#555] text-[13px] mt-1 line-clamp-2">
            {notif.post.content}
          </p>
        )}
      </div>
    </div>
  );
}

export default function NotificationPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  const API = API_URL;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const openCreateModal = () => {
    setIsCreateOpen(true);
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const r = await fetch(`${API}/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = await r.json();
        if (d.success) setNotifications(d.data);
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, [token, API]);

  useEffect(() => {
    if (currentUser && token) {
      const shown = localStorage.getItem("threads_welcome_shown");
      if (!shown) {
        setTimeout(() => {
          toast.success(`Selamat datang di Threads! 🧵`, {
            description: `Halo ${currentUser.name}, selamat menikmati aktivitas terbaru.`,
            duration: 5000,
          });
          localStorage.setItem("threads_welcome_shown", "1");
        }, 500);
      }
    }
  }, [currentUser, token]);

  return (
    <div className="h-screen overflow-hidden bg-[#101010] text-white flex">
      <LoggedInSidebar onCreateThread={openCreateModal} />

      <main className="flex-1 flex flex-col h-screen relative pt-[56px] lg:pt-0 pb-[64px] overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-center pt-3 pb-2">
  <h1 className="text-[22px] font-bold text-white">
    Activity
  </h1>
</div>

        {/* Desktop Header */}
        <div className="hidden lg:sticky lg:top-0 lg:z-40 lg:flex bg-[#101010]/95 backdrop-blur-md">
          <div className="flex items-center justify-center px-5 h-[60px] max-w-[640px] mx-auto w-full">
            <h1 className="text-[15px] font-bold text-white">Activity</h1>
          </div>
        </div>

        <div className="flex-1 flex justify-center px-4 pt-2 overflow-hidden">
  <div className="w-full max-w-[640px] h-full overflow-hidden">
    {loading ? (
      <div className="bg-[#181818] rounded-2xl flex items-center justify-center h-full">
        <Loader2 size={28} className="animate-spin text-[#555]" />
      </div>
    ) : notifications.length === 0 ? (
      <div className="bg-[#181818] rounded-2xl flex items-center justify-center h-full">
        <p className="text-[#555] text-[15px] italic">
          No activity yet.
        </p>
      </div>
    ) : (
      <div className="bg-[#181818] rounded-2xl h-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {notifications.map((n) => (
          <NotifItem
            key={n.id}
            notif={n}
            onOpenPost={(postId) => navigate(`/post/${postId}`)}
          />
        ))}
      </div>
    )}
  </div>
</div>

        <div className="hidden lg:block">
          <FloatingCreateButton onClick={openCreateModal} />
        </div>
      </main>

      <CreatePostModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
