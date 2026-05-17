import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../services/api";
import { useAuthStore } from "../stores/authStore";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatarUrl?: string | null;
  };
};

type PostDetail = {
  id: string;
  content: string;
  imageUrl?: string | null;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  user: {
    id: string;
    name: string;
    username: string;
    avatarUrl?: string | null;
  };
  comments: Comment[];
};

export default function PostDetailPage() {
  const { id } = useParams();
  const token = useAuthStore((state) => state.token);

  const [post, setPost] = useState<PostDetail | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  async function getPostDetail() {
    setLoading(true);

    const result = await apiFetch(`/posts/${id}`);

    if (result.success) {
      setPost(result.data);
    }

    setLoading(false);
  }

  async function handleCreateComment(e: React.FormEvent) {
    e.preventDefault();

    if (!token) {
      alert("Login dulu untuk komentar.");
      return;
    }

    if (!comment.trim()) {
      alert("Komentar wajib diisi.");
      return;
    }

    const result = await apiFetch("/comments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        postId: id,
        content: comment,
      }),
    });

    if (result.success) {
      setComment("");
      await getPostDetail();
    } else {
      alert(result.message || "Gagal membuat komentar");
    }
  }

  useEffect(() => {
    getPostDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pb-20">
        Loading detail...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white pb-20">
        Postingan tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="sticky top-0 border-b border-zinc-800 bg-black/80 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link to="/" className="text-zinc-400 hover:text-white">
            ← Kembali
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center gap-3">
  <img
    src={
      post.user.avatarUrl ||
      "https://ui-avatars.com/api/?name=User"
    }
    alt={post.user.name}
    className="w-12 h-12 rounded-full object-cover border border-zinc-700"
  />

  <div>
    <h2 className="font-semibold">
      {post.user.name}
    </h2>

    <p className="text-sm text-zinc-500">
      @{post.user.username}
    </p>
  </div>
</div>

          <p className="mt-4 whitespace-pre-wrap">{post.content}</p>

          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="post"
              className="mt-4 rounded-2xl w-full"
            />
          )}

          <div className="mt-4 flex gap-6 text-sm text-zinc-400">
            <span>❤️ {post.likeCount}</span>
            <span>💬 {post.commentCount}</span>
          </div>
        </div>

        <form
          onSubmit={handleCreateComment}
          className="border border-zinc-800 rounded-2xl p-4"
        >
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tulis komentar..."
            className="w-full bg-transparent outline-none resize-none min-h-[80px] text-white"
          />

          <div className="flex justify-end mt-3">
            <button
              type="submit"
              className="bg-white text-black px-5 py-2 rounded-xl font-medium"
            >
              Comment
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {post.comments.map((item) => (
            <div
              key={item.id}
              className="border border-zinc-800 rounded-2xl p-4"
            >
              <div className="flex items-start gap-3">
  <img
    src={item.user.avatarUrl || "https://ui-avatars.com/api/?name=User"}
    alt={item.user.name}
    className="w-10 h-10 rounded-full object-cover border border-zinc-700"
  />

  <div>
    <h3 className="font-semibold">{item.user.name}</h3>
    <p className="text-sm text-zinc-500">@{item.user.username}</p>
    <p className="mt-3">{item.content}</p>
  </div>
</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}