import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, Send } from "lucide-react";

interface User {
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
  user: User;
  likeCount: number;
  commentCount: number;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: User;
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
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const token = sessionStorage.getItem("threads_token");

  // Load Komentar
  async function loadComments() {
    try {
      setLoadingComments(true);
      setError("");
      
      const res = await fetch(`${BACKEND_URL}/posts/${post.id}/comments`);
      const result = await res.json();

      if (result.success) {
        setComments(result.data);
      } else {
        setError(result.message || "Gagal memuat komentar");
      }
    } catch (err) {
      setError("Gagal terhubung ke server untuk mengambil komentar.");
    } finally {
      setLoadingComments(false);
    }
  }

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.id]);

  // Kirim Komentar Baru
  async function handleSendComment() {
    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }
    if (!commentText.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch(`${BACKEND_URL}/posts/${post.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentText.trim() }),
      });

      const result = await res.json();
      if (result.success) {
        setCommentText("");
        setComments((prev) => [...prev, result.data]);
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
    <div className="min-h-screen bg-[#101010] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#101010]/90 backdrop-blur-md border-b border-[#1e1e1e] px-4 py-3 flex items-center gap-4">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-[#1a1a1a] transition-colors">
          <ArrowLeft size={20} />
        </button>
        <span className="font-bold text-lg">Thread</span>
      </div>

      {/* Main Post */}
      <div className="p-4 border-b border-[#1e1e1e]">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-full bg-zinc-700 flex-shrink-0 flex items-center justify-center text-sm font-bold">
            {post.user.name ? post.user.name[0].toUpperCase() : "U"}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-[15px]">{post.user.username || post.user.name}</h4>
            <p className="text-[15px] text-[#e0e0e0] mt-1 whitespace-pre-wrap">{post.content}</p>
            {post.imageUrl && (
              <img src={post.imageUrl} alt="Post media" className="mt-3 rounded-xl max-h-80 w-full object-cover border border-[#2a2a2a]" />
            )}
          </div>
        </div>
      </div>

      {/* Input Komentar */}
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
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 text-center border-b border-[#1e1e1e] text-[#666] text-sm">
          Silakan{" "}
          <button onClick={onLoginRequired} className="text-white underline font-semibold">
            Login
          </button>{" "}
          untuk membalas thread ini.
        </div>
      )}

      {/* List Komentar */}
      <div className="divide-y divide-[#1e1e1e]">
        {loadingComments ? (
          <div className="flex justify-center py-10">
            <Loader2 size={24} className="animate-spin text-[#555]" />
          </div>
        ) : error ? (
          <div className="p-6 text-center text-xs text-rose-400">{error}</div>
        ) : comments.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#555]">Belum ada komentar.</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="p-4 flex gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center text-xs font-bold text-zinc-400">
                {comment.user?.name ? comment.user.name[0].toUpperCase() : "U"}
              </div>
              <div className="flex-1">
                <span className="font-semibold text-sm text-white block">
                  {comment.user?.username || comment.user?.name || "Anonymous"}
                </span>
                <p className="text-[14px] text-[#ccc] mt-0.5 whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}