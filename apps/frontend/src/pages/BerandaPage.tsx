import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import logoThreads from "../assets/images/logo-threads-no-login-no-text.png";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../services/api";
import ThreadDetail from "../components/ThreadDetail";
import { useAuthStore } from "../stores/auth.store";
import { toast } from "sonner";

import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Home,
  Plus,
  User,
} from "lucide-react";

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
  comments?: any[];
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
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className={`w-full h-full ${color} flex items-center justify-center text-white font-semibold`}
          style={{ fontSize: size * 0.36 }}
        >
          {user.name?.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}

// ─── Post Card ─────────────────────────────────────────────────────────

function PostCard({
  post,
  token,
  isLoggedIn,
  onLoginRequired,
  onCommentClick,
}: {
  post: Post;
  token: string | null;
  isLoggedIn: boolean;
  onLoginRequired: () => void;
  onCommentClick: () => void;
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);

  const [imageOpen, setImageOpen] = useState(false);

  const navigate = useNavigate();

  async function handleLike() {
    if (!isLoggedIn || !token) {
      onLoginRequired();
      return;
    }

    try {
      const res = await fetch(`${API_URL}/posts/${post.id}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message);
      }

      setLiked(result.liked);
      setLikeCount(result.likeCount);
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat like");
    }
  }

  return (
    <article
      onClick={onCommentClick}
      className="
        px-4
        py-4
        border-b
        border-[#2a2a2a]
        cursor-pointer
        transition-colors
        hover:bg-white/[0.02]
      "
    >
      <div className="flex gap-3">
        {/* Avatar */}
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

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/login");
              }}
              className="text-[#777] hover:text-white transition-colors"
            >
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* Content */}
          <p className="text-[15px] text-[#e6e6e6] whitespace-pre-wrap leading-[1.55]">
            {post.content}
          </p>

          {/* Image */}
          {post.imageUrl && (
            <>
              <div className="mt-3">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageOpen(true);
                  }}
                  className="
                    rounded-2xl
                    overflow-hidden
                    border
                    border-[#2a2a2a]
                    bg-black
                    w-fit
                    max-w-[260px]
                    lg:max-w-[300px]
                    cursor-pointer
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
                      transition-transform
                      duration-300
                      hover:scale-[1.02]
                    "
                  />
                </div>
              </div>

              {/* IMAGE POPUP */}
              {imageOpen && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageOpen(false);
                  }}
                  className="
                    fixed
                    inset-0
                    z-[999]
                    bg-black
                    flex
                    items-center
                    justify-center
                    p-4
                  "
                >
                  {/* CLOSE BUTTON */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageOpen(false);
                    }}
                    className="
                      absolute
                      top-6
                      left-6
                      z-50
                      w-11
                      h-11
                      flex
                      items-center
                      justify-center
                      rounded-full
                      bg-[#0f0f0f]/72
                      backdrop-blur-xl
                      text-white
                      hover:bg-[#1a1a1a]/80
                      active:scale-95
                      transition-all
                      duration-200
                    "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-45"
                    >
                      <path d="M18 6L6 18" />
                      <path d="M6 6L18 18" />
                    </svg>
                  </button>

                  {/* IMAGE */}
                  <img
                    src={post.imageUrl}
                    alt="Preview"
                    className="
                      max-w-full
                      max-h-full
                      object-contain
                    "
                  />
                </div>
              )}
            </>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 mt-3">
            {/* Like */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
              className={`flex items-center gap-1 transition-colors ${
                liked ? "text-rose-500" : "text-[#777] hover:text-white"
              }`}
            >
              <Heart size={18} className={liked ? "fill-rose-500" : ""} />
              <span className="text-xs">{likeCount}</span>
            </button>

            {/* Comment */}
            <button
              onClick={(e) => {
                e.stopPropagation();

                if (!isLoggedIn) {
                  onLoginRequired();
                  return;
                }

                onCommentClick();
              }}
              className="flex items-center gap-1 text-[#777] hover:text-white transition-colors"
            >
              <MessageCircle size={18} />
              <span className="text-xs">{post.commentCount}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Login Card ────────────────────────────────────────────────────────

function LoginCard({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div
        className="rounded-2xl border border-[#2a2a2a] p-6 text-center"
        style={{ background: "#1E1E1E" }}
      >
        <h2 className="text-white font-bold text-[18px] leading-tight mb-2">
          Log in or sign up for Threads
        </h2>

        <p className="text-[#888] text-[14px] leading-5 mb-5">
          See what people are talking about and join the conversation.
        </p>

        <button
          onClick={onLogin}
          className="
            w-full
            flex
            items-center
            justify-center
            gap-3
            bg-[#101010]
            hover:bg-[#2e2e2e]
            transition-colors
            rounded-xl
            px-4
            py-3.5
          "
        >
          <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#101010] flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
              <rect
                x="2"
                y="2"
                width="20"
                height="20"
                rx="5"
                stroke="white"
                strokeWidth="1.8"
              />
              <circle
                cx="12"
                cy="12"
                r="4.5"
                stroke="white"
                strokeWidth="1.8"
              />
              <circle cx="17.5" cy="6.5" r="1" fill="white" />
            </svg>
          </div>

          <span className="text-white text-[15px]">
            Continue with Instagram
          </span>
        </button>

        <div className="mt-4 flex justify-center">
          <button
            onClick={onLogin}
            className="
              text-[#888]
              hover:text-white
              text-[14px]
              transition-colors
            "
          >
            Log in with username instead
          </button>
        </div>
      </div>

      <div className="text-center px-2">
        <p className="text-[#555] text-[12px] leading-5">
          © 2026 Threads Terms · Privacy Policy · Cookies Policy
        </p>

        <p className="text-[#555] text-[12px] mt-0.5">Report a problem</p>
      </div>
    </div>
  );
}

// ─── Desktop Sidebar ───────────────────────────────────────────────────

function DesktopSidebar({ onNav }: { onNav: (page: string) => void }) {
  return (
    <aside className="hidden lg:flex flex-col w-[88px] sticky top-0 h-screen bg-[#101010]">
      <div className="pl-5 pt-6 pb-8">
        <img
          src={logoThreads}
          alt="Threads"
          className="w-8 h-8 object-contain"
        />
      </div>

      <div className="flex flex-col gap-1 px-3">
        {[
          { id: "home", Icon: Home },
          { id: "create", Icon: Plus },
          { id: "activity", Icon: Heart },
          { id: "profile", Icon: User },
        ].map(({ id, Icon }) => (
          <button
            key={id}
            onClick={() => onNav(id)}
            className={`
              w-14
              h-14
              rounded-2xl
              flex
              items-center
              justify-center
              transition-all
              duration-200
              ${
                id === "home"
                  ? "text-white"
                  : "text-[#777] hover:text-white hover:bg-[#181818]"
              }
            `}
          >
            <Icon size={28} />
          </button>
        ))}
      </div>
    </aside>
  );
}

// ─── Mobile Header ─────────────────────────────────────────────────────

function MobileHeader({
  onLogin,
  isDetail,
  onBack,
}: {
  onLogin: () => void;
  isDetail: boolean;
  onBack: () => void;
}) {
  return (
    <header
      className="
        lg:hidden
        fixed
        top-0
        left-0
        right-0
        z-50
        h-[56px]
        flex
        items-center
        justify-between
        px-4
        backdrop-blur-xl
        bg-[#101010]/70
        border-b
        border-white/[0.03]
      "
    >
      {/* LEFT */}
      <div className="w-16 flex items-center">
        {isDetail && (
          <button
            onClick={onBack}
            className="
              w-9
              h-9
              rounded-full
              border
              border-[#101010]
              flex
              items-center
              justify-center
              text-white
            "
          >
            <ArrowLeft size={24} />
          </button>
        )}
      </div>

      {/* CENTER */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <img src={logoThreads} alt="Threads" className="h-7 object-contain" />
      </div>

      {/* RIGHT */}
      <button
        onClick={onLogin}
        className="
    bg-white
    text-black
    text-[13px]
    font-semibold
    px-4
    py-1.5
    rounded-xl
  "
      >
        Log in
      </button>
    </header>
  );
}

// ─── Mobile Bottom Nav ─────────────────────────────────────────────────

function MobileBottomNav({ onNav }: { onNav: (page: string) => void }) {
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
          onClick={() => onNav(id)}
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
          <Icon size={24} />
        </button>
      ))}
    </nav>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────

export default function BerandaPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const navigate = useNavigate();

  const currentUser = useAuthStore((state) => state.user);

  const token = useAuthStore((state) => state.token);

  const isLoggedIn = !!currentUser && !!token;

  async function handleOpenPost(postId: string) {
    try {
      const res = await fetch(`${API_URL}/posts/${postId}`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Gagal mengambil detail postingan");
      }

      setSelectedPost(data.data);
    } catch (error: any) {
      toast.error(error.message || "Gagal membuka detail postingan");
    }
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/posts`);

        const data = await res.json();

        if (data.success) {
          setPosts(data.data);
        }
      } catch {
        toast.error("Gagal mengambil data postingan");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function handleNav(page: string) {
    if (page === "home") return;

    navigate("/login");
  }

  return (
    <div className="bg-[#101010] text-white">
      {/* Mobile Header */}
      <MobileHeader
        onLogin={() => navigate("/login")}
        isDetail={!!selectedPost}
        onBack={() => setSelectedPost(null)}
      />

      <div className="flex max-w-[1220px] mx-auto min-h-screen">
        {/* Sidebar */}
        <DesktopSidebar onNav={handleNav} />

        {/* Main */}
        <main className="flex-1 min-w-0 lg:max-w-[660px] pt-[56px] lg:pt-0">
          {/* Desktop Header */}
          <div
            className="
    hidden
    lg:flex
    items-center
    justify-center
    h-[52px]
    sticky
    top-0
    z-30
    bg-[#101010]
    px-4
    relative
  "
          >
            {selectedPost && (
              <button
                onClick={() => setSelectedPost(null)}
                className="
        absolute
        left-2
        w-8
        h-8
        rounded-full
        border
        border-[#2a2a2a]
         bg-[#181818]
        flex
        items-center
        justify-center
        text-white
        hover:bg-[#1a1a1a]
        transition
      "
              >
                <ArrowLeft size={20} />
              </button>
            )}

            <h1 className="text-[17px] font-semibold">
              {selectedPost ? "Thread" : "Home"}
            </h1>
          </div>

          {/* Post Container */}
          <div
            className="
              lg:mt-1
              lg:h-[calc(100vh-57px)]
              lg:overflow-hidden
              rounded-none
              lg:rounded-t-3xl
              lg:rounded-b-none
              border
              border-[#2a2a2a]
              bg-[#101010]
              lg:bg-[#1E1E1E]
            "
          >
            {/* Scroll Area */}
            <div
              className="
                h-full
                overflow-y-auto
                [scrollbar-width:none]
                [-ms-overflow-style:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              {selectedPost ? (
                <div className="min-h-full">
                  {/* MAIN POST */}
                  <PostCard
                    post={selectedPost}
                    token={token}
                    isLoggedIn={isLoggedIn}
                    onLoginRequired={() => navigate("/login")}
                    onCommentClick={() => {}}
                  />

                  {/* COMMENTS */}
                  <div className="divide-y divide-[#2a2a2a]">
                    {selectedPost.comments?.length ? (
                      selectedPost.comments.map((comment) => (
                        <div key={comment.id} className="px-4 py-4 flex gap-3">
                          {/* Avatar */}
                          <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-700 flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {comment.user.avatarUrl ? (
                              <img
                                src={comment.user.avatarUrl}
                                alt={comment.user.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              comment.user.name?.charAt(0).toUpperCase()
                            )}
                          </div>

                          {/* Comment */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-white">
                                {comment.user.username || comment.user.name}
                              </span>

                              <span className="text-xs text-[#777]">
                                {timeAgo(comment.createdAt)}
                              </span>
                            </div>

                            <p className="text-sm text-[#ddd] mt-1 whitespace-pre-wrap leading-6">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-10 text-center text-[#666] text-sm">
                        Belum ada komentar.
                      </div>
                    )}
                  </div>
                </div>
              ) : loading ? (
                <div className="flex justify-center py-16">
                  <div className="w-6 h-6 border-2 border-[#444] border-t-white rounded-full animate-spin" />
                </div>
              ) : posts.length === 0 ? (
                <div className="py-16 text-center text-[#666]">
                  Belum ada postingan.
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    token={token}
                    isLoggedIn={isLoggedIn}
                    onLoginRequired={() => navigate("/login")}
                    onCommentClick={() => handleOpenPost(post.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Mobile Spacer */}
          <div className="lg:hidden h-20" />
        </main>

        {/* Right Sidebar */}
        <aside
          className="
            hidden
            lg:block
            w-[340px]
            flex-shrink-0
            pt-[56px]
            px-5
            sticky
            top-0
            h-screen
          "
        >
          <LoginCard onLogin={() => navigate("/login")} />
        </aside>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav onNav={handleNav} />
    </div>
  );
}
