import { useState } from "react";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { useAuthStore } from "../stores/auth.store";
import { API_URL } from "@/services/api";

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

export interface ThreadDetailProps {
  post: Post;
  onBack: () => void;
  isLoggedIn: boolean;
  onLoginRequired: () => void;
}

export default function ThreadDetail({
  post,
  onBack,
  isLoggedIn,
  onLoginRequired,
}: ThreadDetailProps) {
  const BACKEND_URL = API_URL;

  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = useAuthStore((state) => state.token);
  const comments = post.comments || [];

  async function handleSendComment() {
    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }

    if (!commentText.trim()) return;

    try {
      setSubmitting(true);

      const res = await fetch(`${BACKEND_URL}/comments`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    postId: post.id,
    content: commentText.trim(),
  }),
});

      const result = await res.json();

      if (result.success) {
        setCommentText("");
        window.location.reload();
      } else {
        alert(result.message || "Gagal mengirim komentar");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat mengirim komentar.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <div className="sticky top-0 z-50 bg-[#1E1E1E]/90 backdrop-blur-md border-b border-[#1e1e1e] px-4 py-3 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-1 rounded-full hover:bg-[#1a1a1a] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="font-bold text-lg">Thread</span>
      </div>

      <div className="px-4 py-4 border-b border-[#2a2a2a]">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-zinc-700 flex-shrink-0 flex items-center justify-center text-sm font-bold">
            {post.user.name ? post.user.name[0].toUpperCase() : "U"}
          </div>

          <div className="flex-1">
            <h4 className="font-semibold text-[15px]">
              {post.user.username || post.user.name}
            </h4>

            <p className="text-[15px] text-[#e0e0e0] mt-1 whitespace-pre-wrap">
              {post.content}
            </p>

            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post media"
                className="mt-3 rounded-xl max-h-80 w-full object-cover border border-[#2a2a2a]"
              />
            )}
          </div>
        </div>
      </div>

      {isLoggedIn ? (
        <div className="p-4 border-b border-[#1e1e1e] bg-[#0a0a0a]">
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-zinc-600 flex-shrink-0 flex items-center justify-center text-xs font-bold">
              Me
            </div>

            <div className="flex-1 flex gap-2">
              <input
                type="text"
                placeholder="Reply to this thread..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
                className="flex-1 bg-transparent text-[14px] outline-none placeholder-[#555]"
              />

              <button
                onClick={handleSendComment}
                disabled={submitting || !commentText.trim()}
                className="text-white hover:text-blue-400 disabled:opacity-40 transition-colors"
              >
                {submitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 text-center border-b border-[#1e1e1e] text-[#666] text-sm">
          Silakan{" "}
          <button
            onClick={onLoginRequired}
            className="text-white underline font-semibold"
          >
            Login
          </button>{" "}
          untuk membalas thread ini.
        </div>
      )}

      <div className="divide-y divide-[#2a2a2a]">
        {comments.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#555]">
            Belum ada komentar.
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="p-4 flex gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center text-xs font-bold text-zinc-400">
                {comment.user?.name
                  ? comment.user.name[0].toUpperCase()
                  : "U"}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-white">
                    {comment.user?.username ||
                      comment.user?.name ||
                      "Anonymous"}
                  </span>

                  <span className="text-xs text-[#666]">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>

                <p className="text-[14px] text-[#ccc] mt-0.5 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}