import { useState } from "react";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
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
  isLiked?: boolean;
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

  const [liked, setLiked] = useState(post.isLiked || false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [imageOpen, setImageOpen] = useState(false);

  const token = useAuthStore((state) => state.token);
  const currentUser = useAuthStore((state) => state.user);

  async function handleLike() {
    if (!token) {
      navigate("/login");
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
        throw new Error(result.message || "Gagal like postingan");
      }

      setLiked(result.liked);
      setLikeCount(result.likeCount);
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan.");
    }
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
        throw new Error(result.message);
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
        throw new Error(result.message);
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
        {/* Avatar */}
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

        {/* Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">
                {post.user.username}
              </span>

              <span className="text-[#777] text-sm">
                {timeAgo(post.createdAt)}
              </span>
            </div>

            {/* More Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="
                text-[#777]
                hover:text-white
                transition-all
                duration-200
                hover:scale-110
                active:scale-95
              "
            >
              <MoreHorizontal size={18} />
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 top-7 z-20 w-36 rounded-xl border border-[#262626] bg-[#111] overflow-hidden shadow-xl">
                <button
  onClick={() => {
    if (currentUser?.id !== post.user.id) {
  toast.error("Anda tidak punya akses untuk mengedit postingan ini.");
  setMenuOpen(false);
  return;
}

setEditOpen(true);
setMenuOpen(false);
  }}
  className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#1a1a1a]"
>
  Edit
</button>

<button
  onClick={() => {
    if (currentUser?.id !== post.user.id) {
  toast.error("Anda tidak punya akses untuk menghapus postingan ini.");
  setMenuOpen(false);
  return;
}

handleDeletePost();
setMenuOpen(false);
  }}
  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#1a1a1a]"
>
  Delete
</button>
              </div>
            )}
          </div>

          {/* Text */}
          <p className="text-[15px] text-[#f5f5f5] leading-6 mt-1 whitespace-pre-wrap">
            {post.content}
          </p>

          {/* Image */}
          {post.imageUrl && (
            <>
              <div
                onClick={() => setImageOpen(true)}
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
        cursor-pointer
        transition-all
        duration-200
        hover:scale-[1.01]
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

              {/* IMAGE POPUP */}
              {imageOpen && (
                <div
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
                  {/* Close Button */}
                  <button
                    onClick={() => setImageOpen(false)}
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

                  {/* Image */}
                  <img
                    src={post.imageUrl}
                    alt=""
                    className="
            max-w-full
            max-h-full
            object-contain
            rounded-xl
          "
                  />
                </div>
              )}
            </>
          )}

          {/* Actions */}
          <div className="flex items-center gap-6 mt-4">
            {/* LIKE */}
            <button
              onClick={handleLike}
              className={`
                flex
                items-center
                gap-1
                transition-all
                duration-200
                hover:scale-110
                active:scale-95
                ${liked ? "text-[#FF0034]" : "text-[#999] hover:text-[#FF0034]"}
              `}
            >
              <Heart size={20} className={liked ? "fill-[#FF0034]" : ""} />

              <span className="text-sm">{likeCount}</span>
            </button>

            {/* COMMENT */}
            <button
              onClick={() => navigate(`/post/${post.id}`)}
              className="
                flex
                items-center
                gap-1
                text-[#999]
                transition-all
                duration-200
                hover:text-white
                hover:scale-110
                active:scale-95
              "
            >
              <MessageCircle size={20} />

              <span className="text-sm">{post.commentCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-[#111] border border-[#262626] rounded-2xl p-5">
            <h2 className="text-lg font-bold mb-4">Edit Postingan</h2>

            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="
                w-full
                min-h-[140px]
                bg-[#1a1a1a]
                border
                border-[#333]
                rounded-xl
                px-4
                py-3
                outline-none
                text-white
                resize-none
              "
              placeholder="Tulis postingan..."
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setEditOpen(false)}
                className="
                  flex-1
                  border
                  border-[#333]
                  rounded-xl
                  py-2
                  hover:bg-[#1a1a1a]
                "
              >
                Batal
              </button>

              <button
                onClick={handleUpdatePost}
                disabled={saving}
                className="
                  flex-1
                  bg-white
                  text-black
                  font-bold
                  rounded-xl
                  py-2
                  disabled:opacity-60
                "
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
