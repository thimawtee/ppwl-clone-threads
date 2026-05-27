import { useEffect, useState } from "react";

import logoThreads from "@/assets/images/logo-threads-no-login-no-text.png";

import {
  Heart,
  MessageCircle,
  Repeat2,
  Send,
  MoreHorizontal,
  ArrowLeft,
  Home,
  Plus,
  User,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import { toast } from "sonner";

import { API_URL } from "@/services/api";

import { useAuthStore } from "@/stores/auth.store";

import { MobileBottomNav } from "@/components/Sidebar";

import ThreadDetail from "@/components/ThreadDetail";

// ─── TYPES ─────────────────────────────────────────────

interface User {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: User;
}

interface Post {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  user: User;
  comments?: Comment[];
}

// ─── HELPER ────────────────────────────────────────────

function timeAgo(dateStr: string) {
  const diff = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );

  if (diff < 60) return `${diff}s`;

  if (diff < 3600) {
    return `${Math.floor(diff / 60)}m`;
  }

  if (diff < 86400) {
    return `${Math.floor(diff / 3600)}h`;
  }

  return `${Math.floor(diff / 86400)}d`;
}

// ─── AVATAR ────────────────────────────────────────────

function Avatar({
  user,
  size = 40,
}: {
  user: User;
  size?: number;
}) {
  const colors = [
    "bg-violet-600",
    "bg-blue-600",
    "bg-emerald-600",
    "bg-amber-600",
    "bg-rose-600",
    "bg-cyan-600",
  ];

  const color =
    colors[user.id.charCodeAt(0) % colors.length];

  return (
    <div
      className="rounded-full overflow-hidden flex-shrink-0"
      style={{
        width: size,
        height: size,
      }}
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
        >
          {user.name?.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}

// ─── PAGE ──────────────────────────────────────────────

export default function DetailPostPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const token = useAuthStore((state) => state.token);

  const currentUser = useAuthStore(
    (state) => state.user
  ) as unknown as User | null;

  const isLoggedIn = !!token && !!currentUser;

  const [post, setPost] = useState<Post | null>(null);

  const [loading, setLoading] = useState(true);

  const [liked, setLiked] = useState(false);

  const [likeCount, setLikeCount] = useState(0);

  const [replyOpen, setReplyOpen] = useState(false);

  // ─── FETCH POST ─────────────────────────────────────

  async function fetchPost() {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/posts/${id}`
      );

      const data = await res.json();

      if (data.success) {
        setPost(data.data);

        setLikeCount(data.data.likeCount || 0);
      }
    } catch {
      toast.error("Gagal mengambil detail post");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPost();
  }, [id]);

  // ─── LIKE ───────────────────────────────────────────

  async function handleLike() {
    if (!token) {
      navigate("/login");

      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/posts/${post?.id}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setLiked((prev) => !prev);

      setLikeCount((prev) =>
        liked ? prev - 1 : prev + 1
      );
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  // ─── CLOSE MODAL ───────────────────────────────────

  async function handleReplyClose(
    submitted: boolean
  ) {
    setReplyOpen(false);

    if (submitted) {
      await fetchPost();
    }
  }

  // ─── RENDER ─────────────────────────────────────────

  return (
    <>
      {/* REPLY MODAL */}
      <ThreadDetail
        post={post}
        isOpen={replyOpen}
        onClose={handleReplyClose}
        token={token}
        currentUser={currentUser}
        isLoggedIn={isLoggedIn}
        onLoginRequired={() =>
          navigate("/login")
        }
      />

      <div className="min-h-screen bg-[#101010] text-white">

        <div className="flex max-w-[1920px] mx-auto min-h-screen">

          {/* SIDEBAR */}
          <aside className="hidden lg:flex flex-col w-[550px] sticky top-0 h-screen bg-[#101010]">
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
                  onClick={() => {
                    if (id === "home") {
                      navigate("/");
                    } else if (!token) {
                      navigate("/login");
                    }
                  }}
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

          {/* MAIN */}
          <main className="flex-1 min-w-20 lg:max-w-[960px] pt-[56px] lg:pt-0">

            {/* DESKTOP HEADER */}
            <div
              className="
                hidden
                lg:flex
                items-center
                gap-3
                h-[52px]
                px-4
                sticky
                top-0
                z-30
                bg-[#101010]
              "
            >
              <button
                onClick={() => navigate(-1)}
                className="
                  p-2
                  rounded-full
                  hover:bg-[#1a1a1a]
                  transition-colors
                "
              >
                <ArrowLeft size={20} />
              </button>

              <h1 className="text-[17px] font-semibold">
                Thread
              </h1>
            </div>

            {/* MOBILE HEADER */}
            <div
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
                gap-3
                px-4
                bg-[#101010]/90
                backdrop-blur-xl
                border-b
                border-[#2a2a2a]
              "
            >
              <button
                onClick={() => navigate(-1)}
                className="
                  p-2
                  rounded-full
                  hover:bg-[#1a1a1a]
                  transition-colors
                "
              >
                <ArrowLeft size={20} />
              </button>

              <h1 className="text-[16px] font-semibold">
                Thread
              </h1>
            </div>

            {/* CONTENT */}
            <div
              className="
                lg:mt-1
                border
                border-[#2a2a2a]
                bg-[#101010]
                lg:bg-[#1E1E1E]
              "
            >

              {/* LOADING */}
              {loading && (
                <div className="flex justify-center py-20">
                  <div className="w-6 h-6 border-2 border-[#444] border-t-white rounded-full animate-spin" />
                </div>
              )}

              {/* POST */}
              {!loading && post && (
                <>
                  <div className="px-5 py-5 border-b border-[#2a2a2a]">

                    <div className="flex gap-3">

                      <Avatar
                        user={post.user}
                        size={42}
                      />

                      <div className="flex-1 min-w-0">

                        {/* HEADER */}
                        <div className="flex items-center justify-between mb-1">

                          <div className="flex items-center gap-2">

                            <span className="font-semibold text-[15px]">
                              {post.user.username ||
                                post.user.name}
                            </span>

                            <span className="text-[#777] text-[13px]">
                              {timeAgo(post.createdAt)}
                            </span>
                          </div>

                          <button className="text-[#777] hover:text-white transition-colors">
                            <MoreHorizontal size={18} />
                          </button>
                        </div>

                        {/* CONTENT */}
                        <p className="text-[15px] text-[#e6e6e6] whitespace-pre-wrap leading-[1.6]">
                          {post.content}
                        </p>

                        {/* IMAGE */}
                        {post.imageUrl && (
                          <div className="mt-4">
                            <div
                              className="
                                rounded-2xl
                                overflow-hidden
                                border
                                border-[#2a2a2a]
                                bg-black
                              "
                            >
                              <img
                                src={post.imageUrl}
                                alt="Post"
                                className="
                                  w-full
                                  max-h-[600px]
                                  object-cover
                                "
                              />
                            </div>
                          </div>
                        )}

                        {/* STATS */}
                        <div className="flex items-center gap-4 mt-4 text-[#777] text-sm">

                          <span>
                            {likeCount} likes
                          </span>

                          <span>
                            {post.commentCount} replies
                          </span>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex items-center gap-5 mt-4">

                          {/* LIKE */}
                          <button
                            onClick={handleLike}
                            className={`transition-colors ${
                              liked
                                ? "text-rose-500"
                                : "text-[#777] hover:text-white"
                            }`}
                          >
                            <Heart
                              size={20}
                              className={
                                liked
                                  ? "fill-rose-500"
                                  : ""
                              }
                            />
                          </button>

                          {/* COMMENT */}
                          <button
                            onClick={() => {
                              if (!token) {
                                navigate("/login");

                                return;
                              }

                              setReplyOpen(true);
                            }}
                            className="text-[#777] hover:text-white transition-colors"
                          >
                            <MessageCircle size={20} />
                          </button>

                          {/* REPOST */}
                          <button className="text-[#777] hover:text-white transition-colors">
                            <Repeat2 size={20} />
                          </button>

                          {/* SHARE */}
                          <button className="text-[#777] hover:text-white transition-colors">
                            <Send size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* COMMENTS */}
                  <div>

                    {post.comments?.length ? (
                      post.comments.map(
                        (comment) => (
                          <div
                            key={comment.id}
                            className="
                              px-5
                              py-4
                              border-b
                              border-[#2a2a2a]
                              flex
                              gap-3
                            "
                          >

                            <Avatar
                              user={comment.user}
                              size={36}
                            />

                            <div className="flex-1">

                              <div className="flex items-center gap-2 mb-1">

                                <span className="font-semibold text-[14px]">
                                  {comment.user.username ||
                                    comment.user.name}
                                </span>

                                <span className="text-[#777] text-[12px]">
                                  {timeAgo(
                                    comment.createdAt
                                  )}
                                </span>
                              </div>

                              <p className="text-[14px] text-[#d9d9d9] whitespace-pre-wrap leading-[1.55]">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <div className="py-16 text-center text-[#666]">
                        Belum ada komentar.
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* EMPTY */}
              {!loading && !post && (
                <div className="py-20 text-center text-[#666]">
                  Post tidak ditemukan.
                </div>
              )}
            </div>

            {/* MOBILE SPACER */}
            <div className="lg:hidden h-20" />
          </main>

          {/* RIGHT SIDEBAR */}
          <aside
            className="
              hidden
              lg:block
              w-[340px]
              flex-shrink-0
              pt-[56px]
              px-5
            "
          />
        </div>

        {/* MOBILE NAV */}
        <MobileBottomNav
          currentUser={currentUser}
          activePage="home"
          onNav={(page) => {
            if (page === "home") {
              navigate("/");
            }
          }}
        />
      </div>
    </>
  );
}