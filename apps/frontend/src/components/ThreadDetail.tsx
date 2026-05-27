import { useEffect, useState } from "react";
import {
  Loader2,
  MoreHorizontal,
  Plus,
} from "lucide-react";

import { API_URL } from "@/services/api";
import { toast } from "sonner";

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
}

// ─── Helper ─────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );

  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;

  return `${Math.floor(diff / 86400)}d`;
}

// ─── Component ─────────────────────────────────────

export default function ThreadDetail({
  post,
  isOpen,
  onClose,
  token,
  currentUser,
}: Props) {
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setText("");
    }
  }, [isOpen]);

  if (!isOpen || !post) return null;

  // ─── Submit Comment ─────────────────────

  async function handleSubmit() {
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

      setText("");

      onClose(true);
    } catch (error: any) {
      toast.error(
        error.message || "Gagal membuat komentar"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center">

      {/* Overlay */}
      <div
        onClick={() => onClose(false)}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Modal */}
      <div
        className="
          relative
          z-10
          w-full
          sm:max-w-[620px]
          bg-[#181818]
          rounded-t-3xl
          sm:rounded-3xl
          border
          border-[#2a2a2a]
          overflow-hidden
          shadow-2xl
          max-h-[90vh]
          flex
          flex-col
        "
      >

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]">
          <button
            onClick={() => onClose(false)}
            className="text-sm text-zinc-400 hover:text-white transition"
          >
            Cancel
          </button>

          <span className="font-semibold text-sm">
            Reply
          </span>

          <button className="text-zinc-500">
            <MoreHorizontal size={18} />
          </button>
        </div>

        {/* Post */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="flex gap-3">

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center font-semibold text-white">
              {post.user.name?.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1">

              {/* User */}
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-[14px] text-white">
                  {post.user.username || post.user.name}
                </span>

                <span className="text-[12px] text-zinc-500">
                  {timeAgo(post.createdAt)}
                </span>
              </div>

              {/* Content */}
              <p className="text-[14px] text-zinc-300 whitespace-pre-wrap leading-[1.6]">
                {post.content}
              </p>

              {/* Image */}
              {post.imageUrl && (
                <div className="mt-3 rounded-2xl overflow-hidden border border-[#2a2a2a]">
                  <img
                    src={post.imageUrl}
                    alt=""
                    className="w-full max-h-[320px] object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reply Input */}
        <div className="border-t border-[#2a2a2a] px-5 py-4 flex gap-3">

          {/* Current User Avatar */}
          <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-semibold text-zinc-300">
            {currentUser?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <div className="flex-1">

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Reply to ${
                post.user.username || post.user.name
              }...`}
              rows={3}
              className="
                w-full
                bg-transparent
                outline-none
                resize-none
                text-[14px]
                text-white
                placeholder:text-zinc-500
              "
            />

            {/* Bottom */}
            <div className="flex items-center justify-between mt-3">

              <button className="flex items-center gap-1 text-zinc-500 text-sm">
                <Plus size={15} />
                Post options
              </button>

              <button
                onClick={handleSubmit}
                disabled={!text.trim() || submitting}
                className="
                  bg-white
                  text-black
                  px-5
                  py-1.5
                  rounded-full
                  text-sm
                  font-semibold
                  disabled:opacity-40
                  hover:opacity-90
                  transition
                "
              >
                {submitting ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  "Post"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}