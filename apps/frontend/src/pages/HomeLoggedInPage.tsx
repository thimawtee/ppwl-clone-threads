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
}

// ─── PAGE ──────────────────────────────────────────────────────────────

export default function HomeLoggedInPage() {
  const BACKEND_URL = API_URL;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  const openCreateModal = () => {
    setIsCreateOpen(true);
  };
  async function handleOpenPost(postId: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.success) {
      setSelectedPost(data.data);
    }
  } catch (error) {
    console.error("Gagal membuka detail post", error);
  }
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
    <div className="min-h-screen bg-[#101010] text-white flex">
      {/* Desktop Sidebar */}
      <LoggedInSidebar onCreateThread={openCreateModal} />

      {/* MAIN */}
      <main className="flex-1 flex justify-center">
        <div className="w-full max-w-[640px]">
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
      onEditPost={() => {}}
      onDeletePost={() => {}}
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

    <h1 className="text-[32px] font-bold tracking-tight">
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
    onEditPost={() => {}}
    onDeletePost={() => {}}
  />
) : loading ? (
                <div className="py-20 text-center text-[#777]">Loading...</div>
              ) : (
                posts.map((post) => (
  <FeedPost
    key={post.id}
    post={post}
    onOpenPost={() => handleOpenPost(post.id)}
  />
))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Button Desktop */}
      <div className="hidden lg:block">
        <FloatingCreateButton onClick={openCreateModal} />
      </div>

      {/* Modal */}
      <CreatePostModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
