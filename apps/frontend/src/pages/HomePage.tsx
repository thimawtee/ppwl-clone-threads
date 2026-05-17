import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { useAuthStore } from "../stores/authStore";
import { Link } from "react-router-dom";

type Post = {
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
};

export default function HomePage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const token = useAuthStore((state) => state.token);

  async function getPosts() {
    setLoading(true);

    const result = await apiFetch("/posts");

    if (result.success) {
      setPosts(result.data);
    }

    setLoading(false);
  }

  async function handleCreatePost(e: React.FormEvent) {
  e.preventDefault();

  if (!token) {
    alert("Token tidak ada. Login ulang dulu.");
    return;
  }

  if (!content.trim()) {
    alert("Isi postingan dulu.");
    return;
  }

  const result = await apiFetch("/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      content,
      imageUrl: null,
    }),
  });

  console.log(result);

  if (result.success) {
    setContent("");
    await getPosts();
  } else {
    alert(result.message || "Gagal membuat postingan");
  }
}

  async function handleLike(postId: string) {
  if (!token) {
    alert("Login dulu untuk like postingan.");
    return;
  }

  const result = await apiFetch(`/posts/${postId}/like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (result.success) {
    await getPosts();
  } else {
    alert(result.message || "Gagal like postingan");
  }
}

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* navbar */}
      <div className="sticky top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
  <h1 className="text-xl md:text-2xl font-bold">
    Threads Clone
  </h1>

  <div className="flex items-center gap-2">
    {user && (
  <div className="hidden sm:flex items-center gap-2">
    <img
      src={user.avatarUrl || "https://ui-avatars.com/api/?name=User"}
      alt={user.name}
      className="w-8 h-8 rounded-full object-cover border border-zinc-700"
    />

    <span className="text-sm text-zinc-400">
      @{user.username}
    </span>
  </div>
)}

    <Link
  to="/profile"
  className="text-sm text-zinc-400 hover:text-white"
>
  👤
</Link>

    <Link
      to="/notifications"
      className="text-sm text-zinc-400 hover:text-white"
    >
      🔔
    </Link>

    {user ? (
  <button
    onClick={logout}
    className="bg-white text-black px-3 py-2 rounded-xl text-sm font-medium"
  >
    Logout
  </button>
) : (
  <Link
    to="/login"
    className="bg-white text-black px-3 py-2 rounded-xl text-sm font-medium"
  >
    Login
  </Link>
)}
  </div>
</div>
      </div>

      <form
  onSubmit={handleCreatePost}
  className="border border-zinc-800 rounded-2xl p-4 bg-zinc-950"
>
  <textarea
  value={content}
  onChange={(e) => setContent(e.target.value)}
  placeholder="What's new?"
  className="w-full bg-transparent outline-none resize-none min-h-[80px] text-white"
/>

  <div className="flex justify-end mt-4">
    <button
  type="submit"
  className="bg-white text-black px-6 py-2 rounded-xl font-medium"
>
  Post
</button>
  </div>
</form>

      {/* content */}
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {loading && (
          <p className="text-zinc-400">
            Loading posts...
          </p>
        )}

        {!loading &&
          posts.map((post) => (
            <div
              key={post.id}
              className="border border-zinc-800 rounded-2xl p-4 bg-zinc-950"
            >
              <div className="flex items-center gap-3">
  <img
    src={post.user.avatarUrl || "https://ui-avatars.com/api/?name=User"}
    alt={post.user.name}
    className="w-10 h-10 rounded-full object-cover border border-zinc-700"
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

              <p className="mt-4 whitespace-pre-wrap">
                {post.content}
              </p>

              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="post"
                  className="mt-4 rounded-2xl w-full"
                />
              )}

              <div className="mt-4 flex gap-6 text-sm text-zinc-400">
                <button
  onClick={() => handleLike(post.id)}
  className="hover:text-red-400"
>
  ❤️ {post.likeCount}
</button>
                <Link
  to={`/posts/${post.id}`}
  className="hover:text-blue-400"
>
  💬 {post.commentCount}
</Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}