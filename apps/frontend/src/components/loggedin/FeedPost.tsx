import { useState } from "react";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { API_URL } from "../../services/api";
import { useAuthStore } from "../../stores/auth.store";

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

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 3600) return `${Math.floor(diff / 60)}m`;

  return `${Math.floor(diff / 3600)}h`;
}

export default function FeedPost({ post }: { post: Post }) {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [saving, setSaving] = useState(false);
  const user = useAuthStore((state) => state.user);
  void user;
const token = useAuthStore((state) => state.token);

  async function handleLike() {

    if (!token) {
      navigate("/login");
      return;
    }

    await fetch(`${API_URL}/posts/${post.id}/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    window.location.reload();
  }

  async function handleUpdatePost() {

    if (!token) {
      navigate("/login");
      return;
    }

    if (!editContent.trim()) {
      toast.error("Isi postingan tidak boleh kosong.");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(`${API_URL}/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: editContent.trim(),
        }),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Gagal memperbarui postingan.");
      }

      toast.success("Postingan berhasil diperbarui.");
      setEditOpen(false);
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeletePost() {
    const confirmDelete = confirm("Yakin ingin menghapus postingan ini?");

    if (!confirmDelete) return;

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/posts/${post.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Gagal menghapus postingan.");
      }

      toast.success("Postingan berhasil dihapus.");
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan.");
    }
  }

  return (
    <article
  className="
    border-b
    border-[#2a2a2a]

    px-4
    py-4

    lg:px-6
    lg:py-5
  "
>
      <div className="flex gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 to-green-300 flex items-center justify-center text-white font-bold">
  {post.user.avatarUrl ? (
    <img
      src={post.user.avatarUrl}
      alt={post.user.name}
      className="w-full h-full object-cover"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  ) : (
    post.user.name?.charAt(0).toUpperCase()
  )}
</div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">
                {post.user.username}
              </span>

              <span className="text-[#777] text-sm">
                {timeAgo(post.createdAt)}
              </span>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-[#777] hover:text-white"
            >
              <MoreHorizontal size={18} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-7 z-20 w-36 rounded-xl border border-[#262626] bg-[#111] overflow-hidden shadow-xl">
                <button
                  onClick={() => {
                    setEditOpen(true);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-[#1a1a1a]"
                >
                  Edit
                </button>

                <button
                  onClick={handleDeletePost}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#1a1a1a]"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <p className="text-[15px] text-[#f5f5f5] leading-6 mt-1 whitespace-pre-wrap">
            {post.content}
          </p>

          {post.imageUrl && (
            <div
  className="
    mt-3
    rounded-2xl
    overflow-hidden
    border
    border-[#2a2a2a]
    bg-black

    w-fit
    max-w-[260px]

    lg:max-w-full
  "
>
              <img
  src={post.imageUrl}
  alt=""
  className="
    block
    w-auto
    max-w-full
    max-h-[360px]
    object-contain
  "
/>
            </div>
          )}

          <div className="flex items-center gap-6 mt-4 text-[#999]">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 hover:text-red-400"
            >
              <Heart size={20} />
              <span className="text-sm">{post.likeCount}</span>
            </button>

            <button
              onClick={() => navigate(`/post/${post.id}`)}
              className="flex items-center gap-1 hover:text-white"
            >
              <MessageCircle size={20} />
              <span className="text-sm">{post.commentCount}</span>
            </button>
          </div>
        </div>
      </div>

      {editOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-[#111] border border-[#262626] rounded-2xl p-5">
            <h2 className="text-lg font-bold mb-4">Edit Postingan</h2>

            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full min-h-[140px] bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 outline-none text-white resize-none"
              placeholder="Tulis postingan..."
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setEditOpen(false)}
                className="flex-1 border border-[#333] rounded-xl py-2 hover:bg-[#1a1a1a]"
              >
                Batal
              </button>

              <button
                onClick={handleUpdatePost}
                disabled={saving}
                className="flex-1 bg-white text-black font-bold rounded-xl py-2 disabled:opacity-60"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}