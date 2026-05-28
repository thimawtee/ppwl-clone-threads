import { useEffect, useState, useRef } from "react";
import {
  ArrowLeft,
  Loader2,
  Heart,
  MessageCircle,
  Menu,
  MoreHorizontal,
} from "lucide-react";

import { API_URL } from "@/services/api";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/auth.store";
import ThreadsLogoNoText from "@/assets/images/logo-threads-no-login-no-text.png";

// ─── Types ─────────────────────────────────────

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
  user: User;
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  comments?: Comment[];
}

interface Props {
  post: Post | null;
  isOpen: boolean;
  onClose: (submitted: boolean) => void;
  token: string | null;
  currentUser: User | null;
  isLoggedIn: boolean;
  onLoginRequired: () => void;
  onEditPost: () => void;
  onDeletePost: () => void;
  onRefreshPost: (updatedPost?: Partial<Post>) => void;
}

// ─── Helper ─────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);

  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;

  return `${Math.floor(diff / 86400)}d`;
}

function getAvatarColor(userId: string) {
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

  return colors[userId.charCodeAt(0) % colors.length];
}

// ─── Component ─────────────────────────────────────

export default function ThreadDetail({
  post,
  isOpen,
  onClose,
  token,
  currentUser,
  isLoggedIn,
  onLoginRequired,
  onEditPost,
  onDeletePost,
  onRefreshPost,
}: Props) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const comments = post?.comments || [];
  const liked = post?.isLiked ?? false;
  const likeCount = post?.likeCount ?? 0;
  const [logoutOpen, setLogoutOpen] = useState(false);
const logout = useAuthStore((state) => state.logout);

  // ─── Close menu when click outside ─────────────────────

  useEffect(() => {
    function handleClickOutside() {
      setMenuOpen(false);
    }

    if (menuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuOpen]);

  // ─── Reset input ─────────────────────

  useEffect(() => {
    if (!isOpen) {
      setText("");
    }
  }, [isOpen]);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [text]);

  if (!isOpen || !post) return null;

  // ─── Submit Comment ─────────────────────

  async function handleSubmit() {
    if (!post) return;

    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }

    if (!text.trim()) return;

    try {
      setSubmitting(true);

      const res = await fetch(`${API_URL}/comments`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          postId: post.id,
          content: text,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success("Komentar berhasil dibuat");

      const newComment = data.data || data.comment || data.result;

      setText("");

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      onRefreshPost({
        id: post.id,
        commentCount: post.commentCount + 1,
        comments: newComment
          ? [...(post.comments || []), newComment]
          : post.comments,
      });
    } catch (error: any) {
      toast.error(error.message || "Gagal membuat komentar");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLike() {
    if (!post) return;

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

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      onRefreshPost({
        id: post.id,
        isLiked: data.liked,
        likeCount: data.likeCount,
      });
    } catch (error: any) {
      toast.error(error.message || "Gagal memberikan like");
    }
  }

  return (
    <div
      className="
    w-full
    bg-[#101010]
    text-white
  "
    >
      {/* HEADER */}
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
          <button
            onClick={() => onClose(false)}
            className="
        w-9
        h-9
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
            <ArrowLeft size={24} />
          </button>
        </div>

        {/* CENTER */}
<div className="absolute left-1/2 -translate-x-1/2">
  <img
    src={ThreadsLogoNoText}
    alt="Threads"
    className="w-7 h-7 object-contain"
  />
</div>

        {/* RIGHT MENU */}
<div className="w-16 flex justify-end relative">
  <button
    onClick={(e) => {
      e.stopPropagation();
      setLogoutOpen((prev) => !prev);
    }}
    className="
      w-9
      h-9
      rounded-full
      flex
      items-center
      justify-center
      text-white
      hover:bg-[#1a1a1a]
      transition
    "
  >
    <Menu size={22} />
  </button>

  {logoutOpen && (
    <div
      onClick={(e) => e.stopPropagation()}
      className="
        absolute
        right-0
        top-11
        z-[100]
        w-36
        rounded-xl
        border
        border-[#262626]
        bg-[#181818]
        overflow-hidden
        shadow-xl
      "
    >
      <button
        onClick={() => {
          logout();
          window.location.href = "/login";
        }}
        className="
          w-full
          text-left
          px-4
          py-3
          text-sm
          text-red-400
          hover:bg-[#222]
        "
      >
        Logout
      </button>
    </div>
  )}
</div>
      </div>

      {/* CONTENT */}
      <div className="w-full">
        {/* MAIN POST */}
        <div className="px-4 py-4 border-b border-[#2a2a2a]">
          <div className="flex gap-3">
            {/* AVATAR */}
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              {post.user.avatarUrl ? (
                <img
                  src={post.user.avatarUrl}
                  alt={post.user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
  className={`w-full h-full ${getAvatarColor(
    post.user.id
  )} flex items-center justify-center font-semibold text-white`}
>
                  {post.user.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* BODY */}
            <div className="flex-1 min-w-0">
              {/* USER */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[15px] text-white">
                    {post.user.username || post.user.name}
                  </span>

                  <span className="text-[13px] text-zinc-500">
                    {timeAgo(post.createdAt)}
                  </span>
                </div>

                {/* MENU */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen((prev) => !prev);
                    }}
                    className="text-[#777] hover:text-white transition"
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {menuOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="
                        absolute
                        right-0
                        top-7
                        z-40
                        w-36
                        rounded-xl
                        border
                        border-[#262626]
                        bg-[#111]
                        overflow-hidden
                        shadow-xl
                      "
                    >
                      <button
                        onClick={() => {
                          if (currentUser?.id !== post.user.id) {
                            toast.error(
                              "Anda tidak punya akses untuk mengedit postingan ini.",
                            );

                            setMenuOpen(false);
                            return;
                          }

                          setMenuOpen(false);
                          onEditPost();
                        }}
                        className="
                          w-full
                          text-left
                          px-4
                          py-3
                          text-sm
                          text-white
                          hover:bg-[#1a1a1a]
                          transition
                        "
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          if (currentUser?.id !== post.user.id) {
                            toast.error(
                              "Anda tidak punya akses untuk menghapus postingan ini.",
                            );

                            setMenuOpen(false);
                            return;
                          }

                          setMenuOpen(false);
                          onDeletePost();
                        }}
                        className="
                          w-full
                          text-left
                          px-4
                          py-3
                          text-sm
                          text-red-500
                          hover:bg-[#1a1a1a]
                          transition
                        "
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* CONTENT */}
              <p
                className="
                  mt-1
                  text-[15px]
                  text-zinc-200
                  whitespace-pre-wrap
                  leading-[1.6]
                "
              >
                {post.content}
              </p>

              {/* IMAGE */}
              {post.imageUrl && (
                <div
                  className="
      mt-4
      rounded-2xl
      overflow-hidden
      border
      border-[#2a2a2a]
      bg-black

      w-fit
      max-w-[180px]
sm:max-w-[220px]
md:max-w-[260px]
    "
                >
                  <img
                    src={post.imageUrl}
                    alt="Post"
                    className="
        block
        w-full
        h-auto
        object-cover
      "
                  />
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex items-center gap-5 mt-4">
                {/* LIKE */}
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1 transition-colors ${
                    liked ? "text-rose-500" : "text-[#777] hover:text-white"
                  }`}
                >
                  <Heart size={18} className={liked ? "fill-rose-500" : ""} />

                  <span className="text-xs">{likeCount}</span>
                </button>

                {/* COMMENT */}
                <div className="flex items-center gap-1 text-[#777]">
                  <MessageCircle size={18} />

                  <span className="text-xs">{post.commentCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REPLY INPUT */}
        {isLoggedIn ? (
          <div className="border-b border-[#2a2a2a] px-4 py-4">
            <div
              className="
    w-full
    flex
    items-center
    gap-3
    bg-[#1E1E1E]
    border
    border-[#2a2a2a]
    rounded-[30px]
    px-3
    py-2
    min-h-[56px]
    transition-all
    duration-200
    "
            >
              {/* AVATAR */}
              <div
  className={`
    w-9
    h-9
    rounded-full
    overflow-hidden
    ${currentUser ? getAvatarColor(currentUser.id) : "bg-zinc-800"}
    flex
    items-center
    justify-center
    text-sm
    font-semibold
    text-white
    flex-shrink-0
    self-start
  `}
>
                {currentUser?.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  currentUser?.name?.charAt(0).toUpperCase() || "U"
                )}
              </div>

              {/* TEXTAREA */}
              <div
                className="
          flex-1
          flex
          items-center
          min-h-[36px]
          py-[6px]
        "
              >
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                  }}
                  placeholder={`Reply to ${
                    post.user.username || post.user.name
                  }...`}
                  rows={1}
                  className="
            w-full
            bg-transparent
            outline-none
            resize-none
            overflow-hidden
            text-[14px]
            text-white
            placeholder:text-[#777]
            leading-[22px]
            min-h-[22px]
            max-h-none
          "
                />
              </div>

              {/* SUBMIT */}
              <button
                onClick={handleSubmit}
                disabled={!text.trim() || submitting}
                className="
          w-9
          h-9
          rounded-full
          bg-white
          text-black
          flex
          items-center
          justify-center
          flex-shrink-0
          self-end
          disabled:opacity-40
          transition
          hover:scale-[1.03]
          active:scale-95
        "
              >
                {submitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ArrowLeft size={16} className="rotate-90" />
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="px-4 py-5 border-b border-[#2a2a2a] text-sm text-zinc-500">
            Silakan{" "}
            <button
              onClick={onLoginRequired}
              className="text-white font-semibold underline"
            >
              login
            </button>{" "}
            untuk membalas thread ini.
          </div>
        )}

        {/* COMMENTS */}
        <div className="divide-y divide-[#2a2a2a]">
          {comments.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#666]">
              Belum ada komentar.
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="px-4 py-4 flex gap-3">
                {/* AVATAR */}
                <div
  className={`
    w-9
    h-9
    rounded-full
    overflow-hidden
    ${getAvatarColor(comment.user.id)}
    flex-shrink-0
    flex
    items-center
    justify-center
    text-sm
    font-semibold
    text-white
  `}
>
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

                {/* COMMENT */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[14px] text-white">
                      {comment.user.username || comment.user.name}
                    </span>

                    <span className="text-[12px] text-zinc-500">
                      {timeAgo(comment.createdAt)}
                    </span>
                  </div>

                  <p
                    className="
                      mt-1
                      text-[14px]
                      text-zinc-300
                      whitespace-pre-wrap
                      leading-[1.6]
                    "
                  >
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
