import { useEffect, useState } from "react";

import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  ArrowLeft,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import { toast } from "sonner";

import { API_URL } from "@/services/api";

import { useAuthStore } from "@/stores/auth.store";

import LoggedInSidebar from "@/components/loggedin/LoggedInSidebar";

import ThreadDetail from "@/components/ThreadDetail";
import CreatePostModal from "@/components/CreatePostModal";
import FloatingCreateButton from "@/components/loggedin/FloatingCreateButton";

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

  const [menuOpen, setMenuOpen] = useState(false);
const [editOpen, setEditOpen] = useState(false);
const [editContent, setEditContent] = useState("");
const [saving, setSaving] = useState(false);
const [isCreateOpen, setIsCreateOpen] = useState(false);

  // ─── FETCH POST ─────────────────────────────────────

  async function fetchPost() {
    try {
      setLoading(true);

      const res = await fetch(
  `${API_URL}/posts/${id}`,
  {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  }
);
      const data = await res.json();

      if (data.success) {
  setPost(data.data);

  setLikeCount(data.data.likeCount || 0);
  setLiked(data.data.liked || false);
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

  useEffect(() => {
  function handleClickOutside() {
    setMenuOpen(false);
  }

  if (menuOpen) {
    document.addEventListener(
      "click",
      handleClickOutside
    );
  }

  return () => {
    document.removeEventListener(
      "click",
      handleClickOutside
    );
  };
}, [menuOpen]);

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

      setLiked(data.liked);
setLikeCount(data.likeCount);

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

  async function handleUpdatePost() {
  if (!post || !token) return navigate("/login");

  if (!editContent.trim() && !post.imageUrl) {
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
        imageUrl: post.imageUrl,
      }),
    });

    const data = await res.json();

    if (!data.success) throw new Error(data.message);

    toast.success("Postingan berhasil diperbarui.");
    setEditOpen(false);
    await fetchPost();
  } catch (error: any) {
    toast.error(error.message || "Gagal update postingan.");
  } finally {
    setSaving(false);
  }
}

async function handleDeletePost() {
  if (!post || !token) return navigate("/login");

  const yakin = confirm("Yakin ingin menghapus postingan ini?");
  if (!yakin) return;

  try {
    const res = await fetch(`${API_URL}/posts/${post.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!data.success) throw new Error(data.message);

    toast.success("Postingan berhasil dihapus.");
    navigate("/home");
  } catch (error: any) {
    toast.error(error.message || "Gagal menghapus postingan.");
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
  onLoginRequired={() => navigate("/login")}
  onEditPost={() => {
    setEditContent(post?.content || "");
    setEditOpen(true);
  }}
  onDeletePost={handleDeletePost}
  onRefreshPost={(updatedPost) => {
    if (!post || !updatedPost) return;

    setPost({
      ...post,
      ...updatedPost,
    });

    if (updatedPost.likeCount !== undefined) {
      setLikeCount(updatedPost.likeCount);
    }

    if (updatedPost.isLiked !== undefined) {
      setLiked(updatedPost.isLiked);
    }
  }}
/>

      <div className="min-h-screen bg-[#101010] text-white">

        <div className="w-full min-h-screen flex justify-center">

          <div className="lg:w-[280px] xl:w-[320px] lg:flex-shrink-0">
  <LoggedInSidebar
    onCreateThread={() => setIsCreateOpen(true)}
  />
</div>

          {/* MAIN */}
          <main
  className="
    flex-1
    min-w-0
    max-w-[680px]
    pt-[56px]
    lg:pt-0
    border-l
    border-r
    border-[#1f1f1f]
    bg-[#101010]
  "
>

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

            {/* CONTENT */}
            <div className="bg-[#101010] min-h-screen">

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


  <div className="relative">
    <button
      onClick={(e) => {
  e.stopPropagation();
  setMenuOpen((prev) => !prev);
}}
      className="text-[#777] hover:text-white transition-colors"
    >
      <MoreHorizontal size={18} />
    </button>

    {menuOpen && (
  <div className="absolute right-0 top-7 z-40 w-36 rounded-xl border border-[#262626] bg-[#111] overflow-hidden shadow-xl">
    
    <button
      onClick={() => {
        if (currentUser?.id !== post.user.id) {
          toast.error("Anda tidak punya akses untuk mengedit postingan ini.");
          setMenuOpen(false);
          return;
        }

        setEditContent(post.content);
        setEditOpen(true);
        setMenuOpen(false);
      }}
      className="w-full text-left px-4 py-2 text-sm hover:bg-[#1a1a1a]"
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
      }}
      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#1a1a1a]"
    >
      Delete
    </button>

  </div>
)}
</div>
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
    w-fit
    max-w-full
  "
                            >
                              <img
                                src={post.imageUrl}
                                alt="Post"
                                className="
  max-w-full
  max-h-[720px]
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
          <div className="hidden xl:block w-[320px]" />
        </div>
      </div>
    {editOpen && (
  <div className="fixed inset-0 z-[99999] bg-black/70 flex items-center justify-center px-4">
    <div className="w-full max-w-md bg-[#181818] border border-[#333] rounded-2xl p-5 text-white">
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
          className="flex-1 border border-[#444] text-white rounded-xl py-2 hover:bg-[#222]"
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
  <div className="hidden lg:block">
  <FloatingCreateButton onClick={() => setIsCreateOpen(true)} />
</div>
  
  <CreatePostModal
  open={isCreateOpen}
  onClose={() => setIsCreateOpen(false)}
/>
    </>
  );
}