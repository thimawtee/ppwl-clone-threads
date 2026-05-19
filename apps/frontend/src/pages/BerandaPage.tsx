import { useState, useEffect, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Send,
  Search,
  Home,
  PenSquare,
  Bell,
  User,
  MoreHorizontal,
  Image,
  X,
  Loader2,
  LogIn,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

// ─── Avatar Component ─────────────────────────────────────────────────────────

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

// ─── Post Card ────────────────────────────────────────────────────────────────

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
        {/* Left: avatar + thread line */}
        <div className="flex flex-col items-center flex-shrink-0">
          <Avatar user={post.user} size={36} />
          {/* thread line (decorative) */}
          <div className="w-px flex-1 bg-[#2a2a2a] mt-2 min-h-[24px]" />
        </div>

        {/* Right: content */}
        <div className="flex-1 min-w-0 pb-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-0.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-semibold text-[15px] text-white truncate leading-tight">
                {post.user.username || post.user.name}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <span className="text-[#777] text-sm">
                {timeAgo(post.createdAt)}
              </span>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu((v) => !v)}
                  className="p-1 rounded-full text-[#666] hover:text-white hover:bg-[#2a2a2a] transition-colors"
                >
                  <MoreHorizontal size={18} />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-8 z-50 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-xl min-w-[160px] overflow-hidden">
                    <button className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#2a2a2a] transition-colors">
                      Copy link
                    </button>
                    <button className="w-full text-left px-4 py-3 text-sm text-[#f44] hover:bg-[#2a2a2a] transition-colors">
                      Report
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <p className="text-[15px] leading-6 text-[#e0e0e0] leading-snug mb-2 whitespace-pre-wrap break-words">
            {post.content}
          </p>

          {/* Image */}
          {post.imageUrl && (
            <div className="mb-3 rounded-xl overflow-hidden border border-[#2a2a2a]">
              <img
                src={post.imageUrl}
                alt="Post image"
                className="w-full max-h-80 object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 mt-2 -ml-1">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 p-1 rounded-full text-sm transition-colors ${
                liked
                  ? "text-rose-500"
                  : "text-[#666] hover:text-white hover:bg-[#1e1e1e]"
              }`}
            >
              <Heart size={18} className={liked ? "fill-rose-500" : ""} />
              {likeCount > 0 && (
                <span className="text-xs font-medium">{likeCount}</span>
              )}
            </button>

            <button
              onClick={!isLoggedIn ? onLoginRequired : undefined}
              className="flex items-center gap-1 p-1 rounded-full text-sm text-[#666] hover:text-white hover:bg-[#1e1e1e] transition-colors"
            >
              <MessageCircle size={18} />
              {post.commentCount > 0 && (
                <span className="text-xs font-medium">{post.commentCount}</span>
              )}
            </button>

            <button
              onClick={!isLoggedIn ? onLoginRequired : undefined}
              className="flex items-center gap-1 p-1 rounded-full text-sm text-[#666] hover:text-white hover:bg-[#1e1e1e] transition-colors"
            >
              <Repeat2 size={18} />
            </button>

            <button
              onClick={!isLoggedIn ? onLoginRequired : undefined}
              className="flex items-center gap-1 p-1 rounded-full text-sm text-[#666] hover:text-white hover:bg-[#1e1e1e] transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Create Post Box ──────────────────────────────────────────────────────────

function CreatePostBox({
  currentUser,
  onPost,
}: {
  currentUser: PostUser | null;
  onPost: (content: string, imageUrl?: string) => Promise<void>;
}) {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [posting, setPosting] = useState(false);

  async function handlePost() {
    if (!content.trim()) return;
    setPosting(true);
    try {
      await onPost(content.trim(), imageUrl.trim() || undefined);
      setContent("");
      setImageUrl("");
      setShowImageInput(false);
    } finally {
      setPosting(false);
    }
  }

  if (!currentUser) return null;

  return (
    <div className="px-4 py-4 border-b border-[#1e1e1e]">
      <div className="flex gap-3">
        <Avatar user={currentUser} size={36} />
        <div className="flex-1 min-w-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's new?"
            rows={1}
            className="w-full bg-transparent text-[15px] leading-6 text-white placeholder-[#555] outline-none resize-none pt-1"
            style={{ minHeight: 28, maxHeight: 160 }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${el.scrollHeight}px`;
            }}
          />
          {showImageInput && (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Image URL (optional)"
                className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder-[#555] outline-none focus:border-[#444]"
              />
              <button
                onClick={() => {
                  setShowImageInput(false);
                  setImageUrl("");
                }}
                className="p-1.5 text-[#666] hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          )}
          <div className="flex items-center justify-between mt-2">
            <button
              onClick={() => setShowImageInput((v) => !v)}
              className="p-1.5 text-[#666] hover:text-white rounded-full hover:bg-[#1e1e1e] transition-colors"
            >
              <Image size={18} />
            </button>
            <button
              onClick={handlePost}
              disabled={!content.trim() || posting}
              className="px-5 h-9 rounded-full bg-white text-black text-sm font-semibold disabled:opacity-40 hover:bg-[#e0e0e0] transition-colors"
            >
              {posting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                "Post"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Login Prompt Card (right sidebar) ───────────────────────────────────────

function LoginPromptCard({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5">
      <h3 className="font-bold text-lg text-white mb-1.5">
        Log in or sign up for Threads
      </h3>
      <p className="text-[#888] text-sm mb-4">
        See what people are talking about and join the conversation.
      </p>
      <button
        onClick={onLogin}
        className="w-full flex items-center justify-center gap-2.5 bg-[#242424] hover:bg-[#2e2e2e] border border-[#3a3a3a] text-white rounded-2xl h-14 text-sm font-semibold transition-colors"
      >
        <LogIn size={18} />
        Log in with username
      </button>
      <p className="text-center text-[#555] text-xs mt-4">
        © 2026 Threads Terms · Privacy · Cookies
      </p>
    </div>
  );
}

// ─── Desktop Sidebar Nav ──────────────────────────────────────────────────────

function DesktopSidebar({
  currentUser,
  activePage,
  onNav,
}: {
  currentUser: PostUser | null;
  activePage: string;
  onNav: (page: string) => void;
}) {
  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "search", icon: Search, label: "Search" },
    { id: "create", icon: PenSquare, label: "Create" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="hidden lg:flex flex-col w-[260px] px-3 py-6 sticky top-0 h-screen border-r border-[#1e1e1e] sticky top-0 h-screen">
      {/* Threads logo */}
      <div className="mb-8">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path
            d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm3.35 20.02c-1.02.5-2.17.72-3.35.72-3.97 0-7.2-3.23-7.2-7.2 0-1.18.28-2.29.78-3.27.56-1.08 1.4-2 2.42-2.62.98-.6 2.1-.94 3.27-.94 2.45 0 4.62 1.15 6.02 2.93.23.29.43.6.61.93.26.47.45.97.57 1.5.16.7.2 1.44.1 2.18-.12.87-.43 1.7-.9 2.44-.56.9-1.33 1.64-2.28 2.13z"
            fill="white"
          />
        </svg>
      </div>

      <div className="flex flex-col gap-1 w-full">
        {navItems.map(({ id, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNav(id)}
            className={`flex items-center gap-4 w-full px-4 py-3 rounded-2xl transition-all ${
              activePage === id
                ? "bg-[#1f1f1f] text-white"
                : "text-[#d0d0d0] hover:bg-[#151515]"
            }`}
          >
            {id === "profile" && currentUser ? (
              <Avatar user={currentUser} size={24} />
            ) : (
              <Icon size={22} />
            )}

            <span className="text-[15px] font-medium"></span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// ─── Mobile Bottom Nav ────────────────────────────────────────────────────────

function MobileBottomNav({
  currentUser,
  activePage,
  onNav,
}: {
  currentUser: PostUser | null;
  activePage: string;
  onNav: (page: string) => void;
}) {
  const navItems = [
    { id: "home", icon: Home },
    { id: "search", icon: Search },
    { id: "create", icon: PenSquare },
    { id: "notifications", icon: Bell },
    { id: "profile", icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#101010]/90 backdrop-blur-xl border-t border-[#1e1e1e] flex items-center justify-around px-2 py-2 safe-area-pb">
      {navItems.map(({ id, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onNav(id)}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors ${
            activePage === id ? "text-white" : "text-[#555] hover:text-[#aaa]"
          }`}
        >
          {id === "profile" && currentUser ? (
            <div
              className={`rounded-full overflow-hidden ${
                activePage === id ? "ring-2 ring-white" : ""
              }`}
            >
              <Avatar user={currentUser} size={24} />
            </div>
          ) : (
            <Icon size={24} strokeWidth={activePage === id ? 2.5 : 1.8} />
          )}
        </button>
      ))}
    </nav>
  );
}

// ─── Login Modal ──────────────────────────────────────────────────────────────

function LoginModal({
  onClose,
  onLoginSuccess,
}: {
  onClose: () => void;
  onLoginSuccess: (user: PostUser, token: string) => void;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

  async function handleSubmit() {
    setError("");
    setLoading(true);
    try {
      if (mode === "register") {
        const res = await fetch(`${BACKEND_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        setMode("login");
        setError("Registrasi berhasil! Silakan login.");
        return;
      }
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      onLoginSuccess(data.data.user, data.data.token);
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full sm:max-w-md bg-[#101010] border border-[#2a2a2a] rounded-t-3xl sm:rounded-2xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#666] hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-white mb-1">
          {mode === "login" ? "Log in to Threads" : "Create account"}
        </h2>
        <p className="text-[#666] text-sm mb-5">
          {mode === "login"
            ? "Enter your details to continue"
            : "Join the conversation today"}
        </p>

        {error && (
          <div
            className={`mb-4 px-3 py-2 rounded-lg text-sm ${
              error.includes("berhasil")
                ? "bg-emerald-900/40 text-emerald-400 border border-emerald-800"
                : "bg-rose-900/40 text-rose-400 border border-rose-800"
            }`}
          >
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {mode === "register" && (
            <>
              <input
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#555] outline-none focus:border-[#444] transition-colors"
              />
              <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#555] outline-none focus:border-[#444] transition-colors"
              />
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#555] outline-none focus:border-[#444] transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#555] outline-none focus:border-[#444] transition-colors"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 w-full bg-white text-black font-semibold py-3 rounded-xl text-sm hover:bg-[#e0e0e0] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {mode === "login" ? "Log in" : "Create account"}
        </button>

        <p className="text-center text-[#666] text-sm mt-4">
          {mode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
            className="text-white font-semibold hover:underline"
          >
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}

// ─── Main Beranda Page ────────────────────────────────────────────────────────

export default function BerandaPage() {
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState("home");
  const [showLogin, setShowLogin] = useState(false);

  // Auth state
  const [currentUser, setCurrentUser] = useState<PostUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load auth from sessionStorage on mount
  useEffect(() => {
    try {
      const savedUser = sessionStorage.getItem("threads_user");
      const savedToken = sessionStorage.getItem("threads_token");
      if (savedUser && savedToken) {
        setCurrentUser(JSON.parse(savedUser));
        setToken(savedToken);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Fetch posts
  async function fetchPosts() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${BACKEND_URL}/posts`);
      const data = await res.json();
      if (data.success) {
        setPosts(data.data);
      } else {
        setError("Gagal memuat postingan");
      }
    } catch {
      setError("Tidak dapat terhubung ke server. Pastikan backend berjalan.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLoginSuccess(user: PostUser, tok: string) {
    setCurrentUser(user);
    setToken(tok);
    try {
      sessionStorage.setItem("threads_user", JSON.stringify(user));
      sessionStorage.setItem("threads_token", tok);
    } catch {
      /* ignore */
    }
  }

  function handleLogout() {
    setCurrentUser(null);
    setToken(null);
    try {
      sessionStorage.removeItem("threads_user");
      sessionStorage.removeItem("threads_token");
    } catch {
      /* ignore */
    }
  }

  async function handlePost(content: string, imageUrl?: string) {
    if (!token) return;
    const res = await fetch(`${BACKEND_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content, imageUrl }),
    });
    const data = await res.json();
    if (data.success) {
      // Prepend new post to feed
      const newPost: Post = {
        ...data.data,
        likeCount: 0,
        commentCount: 0,
      };
      setPosts((prev) => [newPost, ...prev]);
    }
  }

  // Pull-to-refresh simulation
  const [refreshing, setRefreshing] = useState(false);
  async function handleRefresh() {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  }

  return (
    <div className="min-h-screen bg-[#101010] text-white font-sans">
      {/* ── Desktop layout ─────────────────────────────────────────────── */}
      <div className="flex min-h-screen max-w-[1280px] mx-auto">
        {/* Left sidebar (desktop) */}
        <DesktopSidebar
          currentUser={currentUser}
          activePage={activePage}
          onNav={(p) => {
            if (p === "create" && !currentUser) {
              setShowLogin(true);
              return;
            }
            setActivePage(p);
          }}
        />

        {/* Main feed */}
        <main className="flex-1 min-w-0 lg:max-w-[640px] border-x border-[#1e1e1e]">
          {/* Top bar (mobile) */}
          <div className="lg:hidden sticky top-0 z-40 bg-[#101010]/90 backdrop-blur-md border-b border-[#1e1e1e] px-4 py-3 flex items-center justify-between">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm3.35 20.02c-1.02.5-2.17.72-3.35.72-3.97 0-7.2-3.23-7.2-7.2 0-1.18.28-2.29.78-3.27.56-1.08 1.4-2 2.42-2.62.98-.6 2.1-.94 3.27-.94 2.45 0 4.62 1.15 6.02 2.93.23.29.43.6.61.93.26.47.45.97.57 1.5.16.7.2 1.44.1 2.18-.12.87-.43 1.7-.9 2.44-.56.9-1.33 1.64-2.28 2.13z"
                fill="white"
              />
            </svg>
            <span className="font-bold text-base">Home</span>
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="text-xs text-[#666] hover:text-white"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="text-xs text-white font-semibold bg-[#1e1e1e] px-3 py-1.5 rounded-full"
              >
                Log in
              </button>
            )}
          </div>

          {/* Desktop header */}
          <div className="hidden lg:flex items-center justify-center h-[60px] border-b border-[#1e1e1e] sticky top-0 bg-[#101010]/90 backdrop-blur-md z-30">
            <h1 className="text-[15px] font-semibold text-white">For you</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="text-sm text-[#666] hover:text-white transition-colors"
              >
                {refreshing ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Refresh"
                )}
              </button>
              {currentUser ? (
                <button
                  onClick={handleLogout}
                  className="text-sm text-[#666] hover:text-white transition-colors"
                >
                  Logout ({currentUser.username || currentUser.name})
                </button>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-sm text-white font-semibold bg-[#1e1e1e] hover:bg-[#2a2a2a] px-4 py-1.5 rounded-full transition-colors"
                >
                  Log in
                </button>
              )}
            </div>
          </div>

          {/* Create post */}
          {currentUser && (
            <CreatePostBox currentUser={currentUser} onPost={handlePost} />
          )}

          {/* Feed content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 size={28} className="animate-spin text-[#555]" />
              <p className="text-[#555] text-sm">Loading threads...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 px-6 text-center">
              <div className="text-4xl mb-1">⚠️</div>
              <p className="text-[#888] text-sm">{error}</p>
              <button
                onClick={fetchPosts}
                className="mt-2 text-sm text-white bg-[#1e1e1e] hover:bg-[#2a2a2a] px-4 py-2 rounded-full transition-colors"
              >
                Try again
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-6">
              <div className="text-4xl mb-1">🧵</div>
              <p className="text-white font-semibold">No threads yet</p>
              <p className="text-[#666] text-sm">
                Be the first to start a conversation.
              </p>
              {!currentUser && (
                <button
                  onClick={() => setShowLogin(true)}
                  className="mt-3 text-sm text-white bg-[#1e1e1e] hover:bg-[#2a2a2a] px-5 py-2.5 rounded-full font-semibold transition-colors"
                >
                  Log in to post
                </button>
              )}
            </div>
          ) : (
            <div>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isLoggedIn={!!currentUser}
                  onLoginRequired={() => setShowLogin(true)}
                />
              ))}
              {/* Bottom padding for mobile nav */}
              <div className="h-20 lg:h-6" />
            </div>
          )}
        </main>

        {/* Right sidebar (desktop only) */}
        <aside className="hidden xl:flex flex-col w-[360px] flex-shrink-0 py-6 px-6 sticky top-0 h-screen overflow-y-auto">
          {!currentUser ? (
            <LoginPromptCard onLogin={() => setShowLogin(true)} />
          ) : (
            <div className="bg-[#181818] border border-[#2a2a2a] rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <Avatar user={currentUser} size={40} />
                <div>
                  <p className="font-semibold text-white text-sm">
                    {currentUser.username || currentUser.name}
                  </p>
                  <p className="text-[#666] text-xs">{currentUser.name}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-2 text-sm text-[#888] hover:text-white border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-xl transition-colors"
              >
                Log out
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav
        currentUser={currentUser}
        activePage={activePage}
        onNav={(p) => {
          if (p === "create" && !currentUser) {
            setShowLogin(true);
            return;
          }
          setActivePage(p);
        }}
      />

      {/* Login modal */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}
