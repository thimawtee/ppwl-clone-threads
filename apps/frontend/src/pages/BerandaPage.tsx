import { useState, useEffect, useRef } from "react";
import logoInstagram from "../assets/images/logo-Instagram.png";
import CreatePostModal from "../components/CreatePostModal";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../services/api";

import {
  Heart,
  MessageCircle,
  Repeat2,
  Send,
  MoreHorizontal,
  Image,
  X,
  Loader2,
} from "lucide-react";

import { DesktopSidebar, MobileBottomNav } from "../components/Sidebar";

// ─── Types ─────────────────────────────────────────────────────────────

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

// ─── Helpers ───────────────────────────────────────────────────────────

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

// ─── Avatar ────────────────────────────────────────────────────────────

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

// ─── Login Prompt Card ─────────────────────────────────────────────────

function LoginPromptCard({ onLogin }: { onLogin: () => void }) {
  return (
    <>
      <div className="bg-[#181818] border border-[#2a2a2a] rounded-3xl p-5">
        <h3 className="font-bold text-[20px] text-white mb-2 leading-tight">
          Log in or sign up for Threads
        </h3>

        <p className="text-[#888] text-sm leading-5 mb-5">
          See what people are talking about and join the conversation.
        </p>

        <button
          onClick={onLogin}
          className="w-full flex items-center justify-center gap-3 bg-black hover:bg-[#1f1f1f] text-white rounded-2xl h-12 text-sm font-semibold transition-colors"
        >
          <img
            src={logoInstagram}
            alt="Instagram"
            className="w-5 h-5 object-contain"
          />
          Continue with Instagram
        </button>
      </div>

      <p className="text-[#555] text-xs leading-5 mt-5 px-1">
        © 2026 Threads <br />
        Terms · Privacy Policy · Cookies Policy
      </p>
    </>
  );
}

// ─── Post Card ─────────────────────────────────────────────────────────

function PostCard({
  post,
  isLoggedIn,
  onLoginRequired,
}: {
  post: Post;
  isLoggedIn: boolean;
  onLoginRequired: () => void;
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleLike() {
    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }

    setLiked((v) => !v);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  }

  return (
    <article className="px-5 py-3.5 border-b border-[#1e1e1e] hover:bg-[#0a0a0a] transition-colors duration-150">
      <div className="flex gap-3.5">
        <div className="flex flex-col items-center flex-shrink-0">
          <Avatar user={post.user} size={36} />
          <div className="w-px flex-1 bg-[#2a2a2a] mt-2 min-h-[24px]" />
        </div>

        <div className="flex-1 min-w-0 pb-2">
          <div className="flex items-center justify-between mb-0.5">
            <span className="font-semibold text-[15px] text-white">
              {post.user.username || post.user.name}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[#777] text-sm">
                {timeAgo(post.createdAt)}
              </span>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu((v) => !v)}
                  className="p-1 rounded-full text-[#666] hover:text-white"
                >
                  <MoreHorizontal size={18} />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-8 z-50 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-xl min-w-[160px] overflow-hidden">
                    <button className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#2a2a2a]">
                      Copy link
                    </button>

                    <button className="w-full text-left px-4 py-3 text-sm text-[#f44] hover:bg-[#2a2a2a]">
                      Report
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="text-[15px] text-[#e0e0e0] mb-2 whitespace-pre-wrap">
            {post.content}
          </p>

          {post.imageUrl && (
            <div className="mb-3 rounded-xl overflow-hidden border border-[#2a2a2a]">
              <img
                src={post.imageUrl}
                alt="Post"
                className="w-full max-h-80 object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 p-1 rounded-full ${
                liked ? "text-rose-500" : "text-[#666] hover:text-white"
              }`}
            >
              <Heart size={18} className={liked ? "fill-rose-500" : ""} />
              {likeCount > 0 && <span className="text-xs">{likeCount}</span>}
            </button>

            <button className="text-[#666] hover:text-white">
              <MessageCircle size={18} />
            </button>

            <button className="text-[#666] hover:text-white">
              <Repeat2 size={18} />
            </button>

            <button className="text-[#666] hover:text-white">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────

export default function BerandaPage() {
  const BACKEND_URL = API_URL;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("home");
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<PostUser | null>(null);

  const [showLogin, setShowLogin] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

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
  }, []);

  return (
    <div className="min-h-screen bg-[#101010] text-white">
      <div className="flex min-h-screen max-w-[1280px] mx-auto">
        {/* Sidebar */}
        <DesktopSidebar
          currentUser={currentUser}
          activePage={activePage}
          onNav={(page) => {
            if (page === "create" && !currentUser) {
              setShowCreateModal(true);
              return;
            }

            setActivePage(page);
          }}
        />

        {/* Main */}
        <main className="flex-1 min-w-0 lg:max-w-[680px] border-x border-[#1e1e1e]">
          <div className="hidden lg:flex items-center justify-center h-[60px] border-b border-[#1f1f1f] sticky top-0 bg-[#101010]/90 backdrop-blur-md z-30">
            <h1 className="text-[17px] font-semibold">Home</h1>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={28} className="animate-spin text-[#555]" />
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isLoggedIn={!!currentUser}
                onLoginRequired={() => navigate("/home")}
              />
            ))
          )}
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden xl:flex flex-col w-[360px] flex-shrink-0 py-6 px-6 sticky top-0 h-screen overflow-y-auto">
          {!currentUser ? (
            <LoginPromptCard onLogin={() => navigate("/home")} />
          ) : (
            <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <Avatar user={currentUser} size={40} />

                <div>
                  <p className="font-semibold text-white text-sm">
                    {currentUser.username}
                  </p>

                  <p className="text-[#666] text-xs">{currentUser.name}</p>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Mobile Nav */}
      <MobileBottomNav
        currentUser={currentUser}
        activePage={activePage}
        onNav={(page) => {
          if (page === "create" && !currentUser) {
            setShowCreateModal(true);
            return;
          }

          setActivePage(page);
        }}
      />
      <CreatePostModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}