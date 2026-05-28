import { useEffect, useState } from "react";
import { API_URL } from "../services/api";
import LoggedInSidebar from "../components/loggedin/LoggedInSidebar";
import FeedComposer from "../components/loggedin/FeedComposer";
import FeedPost from "../components/loggedin/FeedPost";
import { useAuthStore } from "@/stores/auth.store";
import FloatingCreateButton from "@/components/loggedin/FloatingCreateButton";
import ThreadDetail from "@/components/ThreadDetail";
import CreatePostModal from "@/components/CreatePostModal";

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
  comments?: Comment[];
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: PostUser;
}

// ─── PAGE ──────────────────────────────────────────────────────────────

export default function HomeLoggedInPage() {
  const BACKEND_URL = API_URL;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [editOpen, setEditOpen] = useState(false);
const [editContent, setEditContent] = useState("");
const [saving, setSaving] = useState(false);

  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  const openCreateModal = () => {
    setIsCreateOpen(true);
  };

  async function refreshPosts() {
  const res = await fetch(`${BACKEND_URL}/posts`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const data = await res.json();

  if (data.success) {
    setPosts(data.data);
  }
}

  async function handleUpdatePost() {
  if (!selectedPost || !token) return;

  if (!editContent.trim()) {
    alert("Isi postingan tidak boleh kosong.");
    return;
  }

  try {
    setSaving(true);

    const res = await fetch(`${BACKEND_URL}/posts/${selectedPost.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: editContent.trim(),
        imageUrl: selectedPost.imageUrl,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setEditOpen(false);

      setPosts((prev) =>
        prev.map((post) =>
          post.id === selectedPost.id
            ? { ...post, content: editContent.trim() }
            : post
        )
      );

      await handleOpenPost(selectedPost.id);
    }
  } catch (error) {
    console.error("Gagal update post", error);
  } finally {
    setSaving(false);
  }
}

async function handleDeletePost() {
  if (!selectedPost || !token) return;

  const yakin = confirm("Yakin ingin menghapus postingan ini?");
  if (!yakin) return;

  const res = await fetch(`${BACKEND_URL}/posts/${selectedPost.id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (data.success) {
    setSelectedPost(null);
    setPosts((prev) =>
      prev.filter((post) => post.id !== selectedPost.id)
    );
  }
}

  async function handleOpenPost(postId: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.success) {
      const oldPost = posts.find((post) => post.id === postId);

      setSelectedPost({
        ...data.data,
        isLiked: data.data.isLiked ?? oldPost?.isLiked ?? false,
        likeCount: data.data.likeCount ?? oldPost?.likeCount ?? 0,
      });
    }
  } catch (error) {
    console.error("Gagal membuka detail post", error);
  }
}

  function handlePostLikeUpdate(
  updatedPost: Partial<Post> & { id: string }
) {
  setPosts((prev) =>
    prev.map((post) =>
      post.id === updatedPost.id
        ? { ...post, ...updatedPost }
        : post
    )
  );

  setSelectedPost((prev) =>
    prev && prev.id === updatedPost.id
      ? { ...prev, ...updatedPost }
      : prev
  );
}

  useEffect(() => {
    if (!token || !user) {
      window.location.href = "/login";
    }
  }, [token, user]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(`${BACKEND_URL}/posts`, {
  headers: token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {},
});
        const data = await res.json();

        if (data.success) {
          setPosts(data.data);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [BACKEND_URL, token]);

  return (
    <div className="min-h-screen bg-[#101010] text-white">
  <div className="flex max-w-[1280px] mx-auto min-h-screen">
    <LoggedInSidebar onCreateThread={openCreateModal} />

    <main className="flex-1 min-w-0 lg:max-w-[660px] lg:ml-[290px]">
      <div className="w-full">
          {/* ─── MOBILE VIEW ───────────────── */}
<div className="lg:hidden pt-[56px] min-h-screen">
  <div
    className="
      min-h-screen
      bg-[#101010]
    "
  >
    {selectedPost ? (
  <div className="pb-[84px]">
    <ThreadDetail
      post={selectedPost}
      isOpen={true}
      onClose={() => setSelectedPost(null)}
      token={token}
      currentUser={
        user
          ? {
              id: user.id,
              name: user.name,
              username: user.username,
              avatarUrl: user.avatarUrl ?? null,
            }
          : null
      }
      isLoggedIn={true}
      onLoginRequired={() => {}}
      onEditPost={() => {
  setEditContent(selectedPost?.content || "");
  setEditOpen(true);
}}
onDeletePost={handleDeletePost}
onRefreshPost={async (updatedPost) => {
  if (updatedPost?.id) {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === updatedPost.id
          ? { ...post, ...updatedPost }
          : post
      )
    );

    setSelectedPost((prev) =>
      prev && prev.id === updatedPost.id
        ? { ...prev, ...updatedPost }
        : prev
    );

    return;
  }

  await refreshPosts();
}}
    />
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
      <div className="pb-[84px]">
        {posts.map((post) => (
          <FeedPost
  key={post.id}
  post={post}
  onOpenPost={() => handleOpenPost(post.id)}
  onLikeUpdate={handlePostLikeUpdate}
/>
        ))}
      </div>
    )}
  </div>
</div>

          {/* ─── DESKTOP VIEW ───────────────── */}
<div className="hidden lg:block">

  <div
    className="
      pt-4
      pb-6
      px-6
      flex
      items-center
      gap-4
    "
  >
    {selectedPost && (
      <button
        onClick={() => setSelectedPost(null)}
        className="
          w-8
          h-8
          rounded-full
          bg-[#181818]
          flex
          items-center
          justify-center
          hover:bg-[#222]
          transition
        "
      >
        ←
      </button>
    )}

    <h1 className="text-[20px] font-medium tracking-tight">
      {selectedPost ? "Thread" : "For you"}
    </h1>
  </div>

            <div
  className="
    mx-2
    md:mx-6
    border
    border-[#262626]
    rounded-[20px]
    md:rounded-[28px]
    overflow-hidden
    mb-24
    bg-[#101010]
  "
>
              {!selectedPost && (
  <FeedComposer onCreateThread={openCreateModal} />
)}

             {selectedPost ? (
  <ThreadDetail
    post={selectedPost}
    isOpen={true}
    onClose={() => setSelectedPost(null)}
    token={token}
    currentUser={
      user
        ? {
            id: user.id,
            name: user.name,
            username: user.username,
            avatarUrl: user.avatarUrl ?? null,
          }
        : null
    }
    isLoggedIn={true}
    onLoginRequired={() => {}}
    onEditPost={() => {
  setEditContent(selectedPost?.content || "");
  setEditOpen(true);
}}
onDeletePost={handleDeletePost}
onRefreshPost={async (updatedPost) => {
  if (updatedPost?.id) {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === updatedPost.id
          ? { ...post, ...updatedPost }
          : post
      )
    );

    setSelectedPost((prev) =>
      prev && prev.id === updatedPost.id
        ? { ...prev, ...updatedPost }
        : prev
    );

    return;
  }

  await refreshPosts();
}}
  />
) : loading ? (
                <div className="py-20 text-center text-[#777]">Loading...</div>
              ) : (
                posts.map((post) => (
  <FeedPost
  key={post.id}
  post={post}
  onOpenPost={() => handleOpenPost(post.id)}
  onLikeUpdate={handlePostLikeUpdate}
/>
))
              )}
            </div>
          </div>
        </div>
      </main>
      <aside className="hidden lg:block w-[340px] flex-shrink-0" />
  </div>

      {/* Floating Button Desktop */}
      <div className="hidden lg:block">
        <FloatingCreateButton onClick={openCreateModal} />
      </div>
      
      {editOpen && (
  <div className="fixed inset-0 z-[99999] bg-black/70 flex items-center justify-center px-4">
    <div className="w-full max-w-md bg-[#181818] border border-[#333] rounded-2xl p-5 text-white">
      <h2 className="text-lg font-bold mb-4">Edit Postingan</h2>

      <textarea
        value={editContent}
        onChange={(e) => setEditContent(e.target.value)}
        className="w-full min-h-[140px] bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 outline-none text-white resize-none"
      />

      <div className="flex gap-3 mt-4">
        <button
          onClick={() => setEditOpen(false)}
          className="flex-1 border border-[#444] text-white rounded-xl py-2"
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

      {/* Modal */}
      <CreatePostModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
