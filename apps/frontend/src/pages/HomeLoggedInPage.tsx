import { useEffect, useState } from "react";
import { API_URL } from "../services/api";
import LoggedInSidebar from "../components/loggedin/LoggedInSidebar";
import FeedComposer from "../components/loggedin/FeedComposer";
import FeedPost from "../components/loggedin/FeedPost";
import { useAuthStore } from "@/stores/auth.store";
import FloatingCreateButton from "@/components/loggedin/FloatingCreateButton";
import CreatePostModal from "@/components/CreatePostModal";

import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Home,
  Plus,
  User,
} from "lucide-react";

// ─── TYPES ─────────────────────────────────────────────────────────────

interface PostUser {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
}

interface Post {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  user: PostUser;
  likeCount: number;
  commentCount: number;
}

// ─── HELPERS ───────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();

  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;

  return `${Math.floor(diff / 86400)}d`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── AVATAR ────────────────────────────────────────────────────────────

function Avatar({ user, size = 36 }: { user: PostUser; size?: number }) {
  const colors = [
    "bg-violet-600",
    "bg-blue-600",
    "bg-emerald-600",
    "bg-amber-600",
    "bg-rose-600",
    "bg-cyan-600",
    "bg-pink-600",
    "bg-indigo-600",
  ];

  const color = colors[user.id.charCodeAt(0) % colors.length];

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
          className={`w-full h-full ${color} flex items-center justify-center text-white font-semibold`}
          style={{ fontSize: size * 0.36 }}
        >
          {getInitials(user.name)}
        </div>
      )}
    </div>
  );
}

// ─── MOBILE POST CARD ──────────────────────────────────────────────────

function MobilePostCard({ post }: { post: Post }) {
  return (
    <article className="px-4 py-4 border-b border-[#2a2a2a]">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <Avatar user={post.user} size={36} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[15px] text-white">
                {post.user.username || post.user.name}
              </span>

              <span className="text-[#777] text-[13px]">
                {timeAgo(post.createdAt)}
              </span>
            </div>

            <button className="text-[#777] hover:text-white transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* Content */}
          <p className="text-[15px] text-[#e6e6e6] whitespace-pre-wrap leading-[1.55]">
            {post.content}
          </p>

          {/* Image */}
          {post.imageUrl && (
            <div className="mt-3">
              <div
                className="
                  rounded-2xl
                  overflow-hidden
                  border
                  border-[#2a2a2a]
                  bg-black
                  w-fit
                  max-w-[260px]
                "
              >
                <img
                  src={post.imageUrl}
                  alt="Post"
                  className="
                    block
                    w-auto
                    max-w-full
                    max-h-[360px]
                    object-contain
                  "
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 mt-3">
            <button className="text-[#777] hover:text-white transition-colors">
              <Heart size={18} />
            </button>

            <button className="text-[#777] hover:text-white transition-colors">
              <MessageCircle size={18} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── MOBILE BOTTOM NAV ─────────────────────────────────────────────────

function MobileBottomNav({ onCreate }: { onCreate: () => void }) {
  return (
    <nav
      className="
        lg:hidden
        fixed
        bottom-0
        left-0
        right-0
        z-50
        h-[64px]
        flex
        items-center
        justify-around
        backdrop-blur-xl
        bg-[#0A0A0A]/70
        border-t
        border-white/[0.03]
      "
    >
      {[
        { id: "home", Icon: Home },
        { id: "create", Icon: Plus },
        { id: "activity", Icon: Heart },
        { id: "profile", Icon: User },
      ].map(({ id, Icon }) => (
        <button
          key={id}
          onClick={() => {
            if (id === "create") {
              onCreate();
            }
          }}
          className={`
            flex
            items-center
            justify-center
            w-12
            h-12
            transition-opacity
            ${
              id === "home" ? "opacity-100 text-white" : "opacity-50 text-white"
            }
          `}
        >
          {/* ukuran icon disamakan */}
          <Icon size={24} />
        </button>
      ))}
    </nav>
  );
}

// ─── PAGE ──────────────────────────────────────────────────────────────

export default function HomeLoggedInPage() {
  const BACKEND_URL = API_URL;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  const openCreateModal = () => {
    setIsCreateOpen(true);
  };

  useEffect(() => {
    if (!token || !user) {
      window.location.href = "/login";
    }
  }, [token, user]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(`${BACKEND_URL}/posts`);
        const data = await res.json();

        if (data.success) {
          setPosts(data.data);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [BACKEND_URL]);

  return (
    <div className="min-h-screen bg-[#101010] text-white flex">
      {/* Desktop Sidebar */}
      <LoggedInSidebar onCreateThread={openCreateModal} />

      {/* MAIN */}
      <main className="flex-1 flex justify-center">
        <div className="w-full max-w-[640px]">
          {/* ─── MOBILE VIEW ───────────────── */}
         <div className="lg:hidden pt-[56px]">

            {/* Posts */}
           <div className="pb-[84px]">
              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="w-6 h-6 border-2 border-[#444] border-t-white rounded-full animate-spin" />
                </div>
              ) : posts.length === 0 ? (
                <div className="py-16 text-center text-[#666]">
                  Belum ada postingan.
                </div>
              ) : (
  posts.map((post) => (
    <FeedPost
      key={post.id}
      post={post}
    />
  ))
)}
            </div>
          </div>

          {/* ─── DESKTOP VIEW ───────────────── */}
          <div className="hidden lg:block">
            <div className="pt-4 pb-6 px-6">
              <h1 className="text-[32px] font-bold tracking-tight">For you</h1>
            </div>

            <div className="mx-2 md:mx-6 border border-[#262626] rounded-[20px] md:rounded-[28px] overflow-hidden mb-24">
              <FeedComposer onCreateThread={openCreateModal} />

              {loading ? (
                <div className="py-20 text-center text-[#777]">Loading...</div>
              ) : (
                posts.map((post) => <FeedPost key={post.id} post={post} />)
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Button Desktop */}
      <div className="hidden lg:block">
        <FloatingCreateButton onClick={openCreateModal} />
      </div>

      {/* Modal */}
      <CreatePostModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
