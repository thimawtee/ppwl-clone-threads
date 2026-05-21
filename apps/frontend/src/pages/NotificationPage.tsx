import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Search, Heart, User, MoreHorizontal, Loader2, ChevronDown, MessageCircle, UserPlus, X, LogIn } from "lucide-react";
import { toast } from "sonner";
import { API_URL } from "../services/api";
import { useAuthStore } from "../stores/auth.store";

interface NotifActor { id: string; name: string; username: string; avatarUrl: string | null; }
interface NotifPost { id: string; content: string; }
interface Notification { id: string; type: "LIKE"|"COMMENT"|"FOLLOW"; userId: string; actorId: string; isRead: boolean; createdAt: string; actor: NotifActor; post: NotifPost | null; }
interface PostUser { id: string; name: string; username: string; avatarUrl: string | null; }

function timeAgo(d: string): string {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return `${s}s`; if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`; return `${Math.floor(s / 86400)}d`;
}

function getInitials(n: string) { return n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2); }

function Avatar({ user, size = 36 }: { user: { id: string; name: string; avatarUrl: string | null }; size?: number }) {
  const colors = ["bg-violet-600","bg-blue-600","bg-emerald-600","bg-amber-600","bg-rose-600"];
  const c = colors[user.id.charCodeAt(0) % colors.length];
  return (
    <div className="relative flex-shrink-0 rounded-full overflow-hidden" style={{ width: size, height: size }}>
      {user.avatarUrl ? <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
      : <div className={`w-full h-full ${c} flex items-center justify-center text-white font-semibold`} style={{ fontSize: size * 0.36 }}>{getInitials(user.name)}</div>}
    </div>
  );
}

function NotifItem({ notif }: { notif: Notification }) {
  const icons = { LIKE: <Heart size={12} className="fill-rose-500 text-rose-500" />, COMMENT: <MessageCircle size={12} className="text-blue-400" />, FOLLOW: <UserPlus size={12} className="text-emerald-400" /> };
  const texts = { LIKE: "liked your thread", COMMENT: "replied to your thread", FOLLOW: "started following you" };
  return (
    <div className={`flex items-start gap-3 px-6 py-4 border-b border-[#1e1e1e] hover:bg-[#0d0d0d] transition-colors cursor-pointer ${!notif.isRead ? "bg-[#0a0a0a]" : ""}`}>
      <div className="relative flex-shrink-0">
        <Avatar user={notif.actor} size={40} />
        <div className="absolute -bottom-1 -right-1 bg-[#000] rounded-full p-0.5"><div className="bg-[#1a1a1a] rounded-full p-1">{icons[notif.type]}</div></div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2"><span className="font-semibold text-[15px] text-white">{notif.actor.username}</span><span className="text-[#555] text-sm">{timeAgo(notif.createdAt)}</span></div>
        <p className="text-[#777] text-[14px] mt-0.5">{texts[notif.type]}</p>
        {notif.post && <p className="text-[#555] text-[13px] mt-1 line-clamp-2">{notif.post.content}</p>}
      </div>
      {notif.type === "FOLLOW" && <button className="flex-shrink-0 px-5 py-1.5 border border-[#333] rounded-xl text-sm font-semibold text-white hover:bg-[#1a1a1a] transition-colors mt-1">Follow</button>}
    </div>
  );
}

function LoginModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (u: PostUser, t: string) => void }) {
  const [mode, setMode] = useState<"login"|"register">("login");
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const API = API_URL;
  async function submit() {
    setError(""); setLoading(true);
    try {
      if (mode === "register") {
        const r = await fetch(`${API}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        const d = await r.json(); if (!d.success) throw new Error(d.message);
        setMode("login"); setError("Registrasi berhasil! Silakan login."); return;
      }
      const r = await fetch(`${API}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.email, password: form.password }) });
      const d = await r.json(); if (!d.success) throw new Error(d.message);
      onSuccess(d.data.user, d.data.token);
      toast.success(`Selamat datang, ${d.data.user.name}! 🎉`, { description: "Anda berhasil login ke Threads.", duration: 4000 });
      onClose();
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Error"); } finally { setLoading(false); }
  }
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full sm:max-w-md bg-[#101010] border border-[#2a2a2a] rounded-t-3xl sm:rounded-2xl p-6">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-[#666] hover:text-white"><X size={20} /></button>
        <h2 className="text-xl font-bold text-white mb-1">{mode === "login" ? "Log in to Threads" : "Create account"}</h2>
        <p className="text-[#666] text-sm mb-5">{mode === "login" ? "Enter your details" : "Join the conversation"}</p>
        {error && <div className={`mb-4 px-3 py-2 rounded-lg text-sm ${error.includes("berhasil") ? "bg-emerald-900/40 text-emerald-400 border border-emerald-800" : "bg-rose-900/40 text-rose-400 border border-rose-800"}`}>{error}</div>}
        <div className="flex flex-col gap-3">
          {mode === "register" && (<><input type="text" placeholder="Full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#555] outline-none focus:border-[#444]" /><input type="text" placeholder="Username" value={form.username} onChange={e => setForm({...form, username: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#555] outline-none focus:border-[#444]" /></>)}
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#555] outline-none focus:border-[#444]" />
          <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} onKeyDown={e => e.key === "Enter" && submit()} className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-[#555] outline-none focus:border-[#444]" />
        </div>
        <button onClick={submit} disabled={loading} className="mt-4 w-full bg-white text-black font-semibold py-3 rounded-xl text-sm hover:bg-[#e0e0e0] disabled:opacity-50 flex items-center justify-center gap-2">
          {loading && <Loader2 size={16} className="animate-spin" />}{mode === "login" ? "Log in" : "Create account"}
        </button>
        <p className="text-center text-[#666] text-sm mt-4">{mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }} className="text-white font-semibold hover:underline">{mode === "login" ? "Sign up" : "Log in"}</button>
        </p>
      </div>
    </div>
  );
}

export default function NotificationPage() {
  const navigate = useNavigate();
  const API = API_URL;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentUser = useAuthStore((state) => state.user);
const token = useAuthStore((state) => state.token);
const setAuth = useAuthStore((state) => state.setAuth);
const logout = useAuthStore((state) => state.logout);

  useEffect(() => { function h(e: MouseEvent) { if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false); } document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    (async () => { try { setLoading(true); const r = await fetch(`${API}/notifications`, { headers: { Authorization: `Bearer ${token}` } }); const d = await r.json(); if (d.success) setNotifications(d.data); } catch {} finally { setLoading(false); } })();
  }, [token, API]);

  useEffect(() => {
    if (currentUser && token) {
      const shown = localStorage.getItem("threads_welcome_shown");
      if (!shown) { setTimeout(() => { toast.success(`Selamat datang di Threads! 🧵`, { description: `Halo ${currentUser.name}, selamat menikmati aktivitas terbaru.`, duration: 5000 }); localStorage.setItem("threads_welcome_shown", "1"); }, 500); }
    }
  }, [currentUser, token]);

 function handleLogin(u: PostUser, t: string) {
  setAuth(
  {
    ...u,
    email: "",
  },
  t
);
  localStorage.removeItem("threads_welcome_shown");
}

function handleLogout() {
  logout();
  setNotifications([]);
  localStorage.removeItem("threads_welcome_shown");
}

  return (
    <div className="min-h-screen bg-[#000] text-white" style={{ fontFamily: "'Inter Variable', -apple-system, system-ui, sans-serif" }}>
      <div className="flex min-h-screen">
        {/* ── LEFT SIDEBAR (icon-only, like Threads) ─────────────────── */}
        <nav className="hidden lg:flex flex-col items-center w-[76px] py-4 sticky top-0 h-screen justify-between">
          {/* Logo */}
          <div className="pt-2 pb-6">
            <button onClick={() => navigate("/")} className="text-white hover:opacity-70 transition-opacity">
              <svg width="30" height="30" viewBox="0 0 192 192" fill="currentColor">
                <path d="M141.537 88.988c-.787-3.69-2.255-6.96-4.418-9.633-1.98-2.397-4.497-4.374-7.716-5.974-4.78-2.5-10.573-3.8-17.282-3.8-14.09 0-24.72 6.06-31.64 18-5.42 9.56-8.16 21.29-8.16 35 0 .04 0 .09 0 .13.04 13.24 2.91 24.52 8.58 33.68 6.83 11.14 16.86 16.9 29.72 16.9 4.64 0 8.98-.7 12.96-2.1 4.14-1.44 7.74-3.54 10.7-6.22 5.7-5.15 9.62-11.98 11.56-20.24l-14.22-3.51c-1.32 5.33-3.8 9.55-7.32 12.51-3.16 2.62-7.23 3.95-12.11 3.95-7.44 0-13.16-3.12-17.12-9.39-3.51-5.59-5.4-13-5.62-22.12 3.1 3.13 6.6 5.61 10.5 7.46 4.13 1.96 8.65 2.94 13.48 2.94 6 0 11.61-1.37 16.75-4.09 5.28-2.79 9.52-6.8 12.65-11.94 3.24-5.33 4.87-11.45 4.87-18.23 0-5.14-1.37-9.98-4.09-14.38l-1.97.34zm-17.17 24.84c-1.71 3.41-4.1 6.04-7.14 7.88-3 1.8-6.43 2.7-10.23 2.7-3.84 0-7.27-.91-10.29-2.74-3.02-1.83-5.42-4.46-7.18-7.88-1.76-3.43-2.64-7.33-2.64-11.7 0-4.41.87-8.34 2.62-11.76 1.74-3.41 4.12-6.04 7.15-7.87 3.02-1.83 6.45-2.74 10.31-2.74 3.84 0 7.28.91 10.3 2.73 3.02 1.82 5.4 4.45 7.12 7.87 1.72 3.42 2.58 7.39 2.58 11.9 0 4.4-.87 8.28-2.6 11.61z" />
              </svg>
            </button>
          </div>
          {/* Nav icons */}
          <div className="flex flex-col gap-1 items-center">
            <button onClick={() => navigate("/")} className="flex items-center justify-center w-12 h-12 rounded-xl text-[#4d4d4d] hover:text-white transition-colors">
              <Home size={26} strokeWidth={1.5} />
            </button>
            <button className="flex items-center justify-center w-12 h-12 rounded-xl text-[#4d4d4d] hover:text-white transition-colors">
              <Search size={26} strokeWidth={1.5} />
            </button>
            <button className="flex items-center justify-center w-12 h-12 rounded-xl text-white bg-[#181818] hover:bg-[#222] transition-colors">
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <button className="flex items-center justify-center w-12 h-12 rounded-xl text-white transition-colors">
              <Heart size={26} strokeWidth={2} className="fill-white" />
            </button>
            <button onClick={() => navigate("/")} className="flex items-center justify-center w-12 h-12 rounded-xl text-[#4d4d4d] hover:text-white transition-colors">
              <User size={26} strokeWidth={1.5} />
            </button>
          </div>
          {/* Bottom: menu */}
          <div className="pb-2">
            <button className="flex items-center justify-center w-12 h-12 rounded-xl text-[#4d4d4d] hover:text-white transition-colors">
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
        </nav>

        {/* ── MAIN CONTENT ───────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col min-h-screen relative">
          {/* Header */}
          <div className="sticky top-0 z-40 bg-[#000]/95 backdrop-blur-md">
            <div className="flex items-center justify-between px-5 h-[60px] max-w-[640px] mx-auto w-full">
              <div className="w-8" />
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setShowDropdown(v => !v)} className="flex items-center gap-1 text-[15px] font-bold text-white hover:opacity-80 transition-opacity">
                  Activity <ChevronDown size={14} className={`text-[#777] transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                </button>
                {showDropdown && (
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl min-w-[200px] overflow-hidden z-50">
                    <button className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#2a2a2a] font-semibold">Activity</button>
                    <button className="w-full text-left px-4 py-3 text-sm text-[#777] hover:bg-[#2a2a2a]">Requests</button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                {currentUser ? <button onClick={handleLogout} className="text-xs text-[#666] hover:text-white">Logout</button> : <button onClick={() => setShowLogin(true)} className="text-white"><LogIn size={18} /></button>}
                <button className="p-2 text-[#666] hover:text-white transition-colors"><MoreHorizontal size={20} /></button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 flex items-start justify-center px-4 pt-4">
            <div className="w-full max-w-[640px]">
              {!currentUser ? (
                <div className="bg-[#181818] rounded-2xl flex items-center justify-center" style={{ minHeight: "calc(100vh - 180px)" }}>
                  <div className="text-center p-8">
                    <p className="text-[#555] text-[15px] italic mb-6">No activity yet.</p>
                    <button onClick={() => setShowLogin(true)} className="bg-white text-black font-semibold py-2.5 px-6 rounded-xl text-sm hover:bg-[#e0e0e0] transition-colors">Log in</button>
                  </div>
                </div>
              ) : loading ? (
                <div className="bg-[#181818] rounded-2xl flex items-center justify-center" style={{ minHeight: "calc(100vh - 180px)" }}>
                  <Loader2 size={28} className="animate-spin text-[#555]" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="bg-[#181818] rounded-2xl flex items-center justify-center" style={{ minHeight: "calc(100vh - 180px)" }}>
                  <p className="text-[#555] text-[15px] italic">No activity yet.</p>
                </div>
              ) : (
                <div className="bg-[#181818] rounded-2xl overflow-hidden" style={{ minHeight: "calc(100vh - 180px)" }}>
                  {notifications.map(n => <NotifItem key={n.id} notif={n} />)}
                </div>
              )}
            </div>
          </div>

          {/* FAB + button (bottom right) */}
          <button className="fixed bottom-6 right-6 w-12 h-12 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] rounded-full flex items-center justify-center text-white transition-colors shadow-lg z-30">
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#000]/95 backdrop-blur-xl border-t border-[#1e1e1e] flex items-center justify-around px-2 py-2">
        {[{ id: "home", icon: Home, path: "/", active: false }, { id: "search", icon: Search, path: "/", active: false }, { id: "activity", icon: Heart, path: "/activity", active: true }, { id: "profile", icon: User, path: "/", active: false }].map(({ id, icon: Icon, path, active }) => (
          <button key={id} onClick={() => navigate(path)} className={`flex items-center justify-center w-12 h-12 rounded-xl transition-colors ${active ? "text-white" : "text-[#555]"}`}>
            <Icon size={26} strokeWidth={active ? 2.5 : 1.5} className={active ? "fill-white" : ""} />
          </button>
        ))}
      </nav>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSuccess={handleLogin} />}
    </div>
  );
}