import { useState, useEffect } from "react";
import { toast } from "sonner";
import LoggedInSidebar from "../components/loggedin/LoggedInSidebar";
import { API_URL } from "../services/api";
import { useNavigate } from "react-router-dom";
import ThreadDetail from "@/components/ThreadDetail";

import {
  BarChart3,
  Square as Instagram,
  SquarePen,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import FloatingCreateButton from "@/components/loggedin/FloatingCreateButton";
import CreatePostModal from "@/components/CreatePostModal";
import FeedPost from "../components/loggedin/FeedPost";

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email?: string;
  avatarUrl: string | null;
  bio?: string | null;
  provider?: "EMAIL" | "GOOGLE";
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string | null;
  };
}

interface Post {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  user: {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
};
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  comments?: Comment[];
}

function getAvatarColor(userId: string) {
  const colors = [
    "bg-violet-600",
    "bg-blue-600",
    "bg-emerald-600",
    "bg-amber-600",
    "bg-rose-600",
    "bg-cyan-600",
    "bg-pink-600",
    "bg-indigo-600",
  ];

  return colors[userId.charCodeAt(0) % colors.length];
}

export default function ProfilePage() {
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const [user, setUser] = useState<UserProfile | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postsLoading, setPostsLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    avatarUrl: "",
    bio: "",
    password: "",
  });

  const setAuth = useAuthStore((state) => state.setAuth);
  const authUser = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const openCreateModal = () => {
    setIsCreateOpen(true);
  };

  useEffect(() => {
    if (!authUser) return;

    setUser({
      ...authUser,
      avatarUrl: authUser.avatarUrl ?? null,
    });

    setForm({
      name: authUser.name || "",
      username: authUser.username || "",
      email: authUser.email || "",
      avatarUrl: authUser.avatarUrl || "",
      bio: (authUser as any).bio || "",
      password: "",
    });
  }, [authUser]);

  useEffect(() => {
    if (!authUser?.id || !token) return;

    async function fetchUserPosts() {
      try {
        setPostsLoading(true);

        const res = await fetch(`${API_URL}/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success) {
          // Filter hanya post milik user yang login
          const myPosts = data.data.filter(
            (post: any) => post.user.id === authUser!.id,
          );
          setUserPosts(myPosts);

          const counts: Record<string, number> = {};
          myPosts.forEach((p: any) => {
            counts[p.id] = p.likeCount;
          });
        }
      } catch {
        toast.error("Gagal mengambil postingan.");
      } finally {
        setPostsLoading(false);
      }
    }

    fetchUserPosts();
  }, [authUser?.id, token]);

  // Re-fetch posts setelah modal create ditutup
  const handleCreateClose = () => {
    setIsCreateOpen(false);

    if (!authUser?.id || !token) return;

    fetch(`${API_URL}/posts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const myPosts = data.data.filter(
            (post: any) => post.user.id === authUser!.id,
          );
          setUserPosts(myPosts);

          const counts: Record<string, number> = {};
          myPosts.forEach((p: any) => {
            counts[p.id] = p.likeCount;
          });
        }
      })
      .catch(() => {});
  };

  function handlePostLikeUpdate(
  updatedPost: Partial<Post> & { id: string }
) {
  setUserPosts((prev) =>
    prev.map((post) =>
      post.id === updatedPost.id
        ? { ...post, ...updatedPost }
        : post
    )
  );
}

async function handleOpenPost(postId: string) {
  if (!token) return;

  try {
    const res = await fetch(`${API_URL}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.success) {

      setSelectedPost({
  ...data.data,
  user: {
    id: data.data.user.id,
    name: data.data.user.name,
    username: data.data.user.username,
    avatarUrl: data.data.user.avatarUrl ?? null,
  },
});
    }
  } catch {
    toast.error("Gagal membuka thread.");
  }
}

  const userAvatar = user?.avatarUrl || "";

  async function handleUpdateProfile() {
    if (!token) {
      toast.error("Silakan login terlebih dahulu.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name.trim() || !form.username.trim() || !form.email.trim()) {
      toast.error("Nama, username, dan email wajib diisi.");
      return;
    }

    if (!emailRegex.test(form.email)) {
      toast.error("Format email tidak valid.");
      return;
    }

    if (form.password.trim() && form.password.length < 8) {
      toast.error("Password minimal 8 karakter.");
      return;
    }

    try {
      setSaving(true);

      let uploadedAvatarUrl = form.avatarUrl || null;

      if (avatarFile) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(avatarFile);
        });

        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: avatarFile.name,
            fileType: avatarFile.type,
            base64,
          }),
        });

        const uploadData = await uploadRes.json();

        if (!uploadData.success) {
          throw new Error(uploadData.message || "Gagal upload foto profil.");
        }

        uploadedAvatarUrl = uploadData.data.url;
      }

      const body: {
        name: string;
        username: string;
        email: string;
        avatarUrl: string | null;
        bio: string | null;
        password?: string;
      } = {
        name: form.name,
        username: form.username,
        email: form.email,
        avatarUrl: uploadedAvatarUrl,
        bio: form.bio || null,
      };

      if (form.password.trim()) {
        body.password = form.password;
      }

      const res = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Gagal memperbarui profil.");
      }

      setUser(result.data);
      setAuth(result.data, token);
      setEditOpen(false);
      setForm((prev) => ({ ...prev, password: "" }));

      toast.success("Profil berhasil diperbarui.");
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat update profil.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#101010] text-white">
  <div className="flex max-w-[1280px] mx-auto min-h-screen">
      <LoggedInSidebar
  onCreateThread={openCreateModal}
/>

      {selectedPost ? (
  <main className="flex-1 min-w-0 lg:max-w-[660px] lg:ml-[290px] min-h-screen px-3 md:px-4 pt-20 md:pt-6 pb-24 bg-[#101010]">
    <div className="w-full">
      <div className="hidden lg:flex px-4 md:px-6 py-4 items-center gap-4">
        <button
          onClick={() => setSelectedPost(null)}
          className="w-9 h-9 rounded-full bg-[#181818] flex items-center justify-center text-white hover:bg-[#222] transition"
        >
          ←
        </button>

        <h1 className="text-[20px] font-medium tracking-tight">
          Thread
        </h1>
      </div>

      <div className="border border-[#262626] rounded-[20px] md:rounded-[28px] overflow-hidden bg-[#101010]">
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
          onRefreshPost={(updatedPost) => {
            if (!updatedPost?.id) return;

            setUserPosts((prev) =>
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
          }}
        />
      </div>
    </div>
  </main>
) : (

      <main className="flex-1 min-w-0 lg:max-w-[660px] lg:ml-[290px] min-h-screen px-3 md:px-4 pt-[56px] lg:pt-6 pb-24 bg-[#101010]">
        <div className="hidden lg:block">
  <div className="pt-4 pb-6 px-6 flex items-center gap-4">
    <h1 className="text-[20px] font-medium tracking-tight">
  {user?.username || "profile"}
</h1>
  </div>
</div>
        <div className="w-full border border-[#262626] rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#0a0a0a] flex flex-col">

          {/* Info profil */}
          <div className="px-4 md:px-6 pt-4 pb-2">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  {user?.name || "Loading..."}
                </h2>
                <p className="text-sm text-[#777777] mt-0.5">
                  {user?.username ? `${user.username}` : ""}
                </p>
                {user?.bio && (
                  <p className="text-sm text-white mt-4 max-w-[320px] leading-relaxed">
                    {user.bio}
                  </p>
                )}
                <p className="text-sm text-[#777777] mt-5">0 pengikut</p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <div
  className={`
    w-[72px]
    h-[72px]
    rounded-full
    overflow-hidden
    flex
    items-center
    justify-center
    ${getAvatarColor(user?.id || "default")}
  `}
>
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span className="text-white text-2xl font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[#ffffff]">
                  <button className="p-1 rounded-full hover:bg-[#121212] transition-colors">
                    <BarChart3 size={20} className="transform rotate-90" />
                  </button>
                  <button className="p-1 rounded-full hover:bg-[#121212] transition-colors">
                    <Instagram size={20} />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setEditOpen(true)}
              className="w-full mt-4 border border-[#262626] rounded-xl py-2 text-sm font-semibold bg-black hover:bg-[#121212] transition-colors tracking-wide"
            >
              Edit profil
            </button>
          </div>

          {/* Tab navigasi */}
          <div className="flex border-b border-[#1f1f1f] mt-4 text-xs md:text-sm font-semibold overflow-x-auto">
            <div className="min-w-[120px] flex-1 text-center pb-3 border-b border-white text-white cursor-pointer">
              Threads
            </div>
            <div className="min-w-[120px] flex-1 text-center pb-3 text-[#777777] cursor-pointer hover:text-white transition-colors">
              Balasan
            </div>
            <div className="min-w-[120px] flex-1 text-center pb-3 text-[#777777] cursor-pointer hover:text-white transition-colors">
              Media
            </div>
          </div>

          {/* Input buat thread baru */}
          <div className="px-4 md:px-6 py-4 flex items-center justify-between border-b border-[#1f1f1f]">
            <div className="flex items-center gap-3 flex-1">
              <div
  className={`
    w-9
    h-9
    rounded-full
    overflow-hidden
    flex
    items-center
    justify-center
    shrink-0
    ${getAvatarColor(user?.id || "default")}
  `}
>
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt="Mini Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <input
                type="text"
                placeholder="What's New?"
                onFocus={openCreateModal}
                readOnly
                className="bg-transparent text-sm text-white placeholder-[#777777] outline-none flex-1 cursor-pointer"
              />
            </div>
            <button
              onClick={openCreateModal}
              className="border border-[#262626] px-4 py-1.5 rounded-xl text-sm font-semibold text-white bg-black hover:bg-[#121212] transition-colors"
            >
              Post
            </button>
          </div>
          <div className="pb-2">
            {postsLoading ? (
  <div className="flex justify-center py-12">
    <Loader2 size={24} className="animate-spin text-[#555]" />
  </div>
) : userPosts.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-14 text-center px-6">
    <SquarePen size={32} className="text-[#444] mb-3" />
    <p className="text-sm font-semibold text-white mb-1">
      Belum ada thread
    </p>
    <p className="text-xs text-[#777777] mb-5 leading-relaxed">
      Bagikan apa yang ada di pikiranmu.
    </p>
    <button
      onClick={openCreateModal}
      className="bg-white text-black text-xs font-bold px-6 py-2 rounded-xl hover:bg-[#e6e6e6] transition-colors"
    >
      Buat thread
    </button>
  </div>
) : (
  userPosts.map((post) => (
    <FeedPost
      key={post.id}
      post={{
        ...post,
        user: {
          id: user?.id ?? "",
          name: user?.name ?? "",
          username: user?.username ?? "",
          avatarUrl: user?.avatarUrl ?? null,
        },
      }}
      onLikeUpdate={handlePostLikeUpdate}
      onOpenPost={() => handleOpenPost(post.id)}
    />
  ))
)}
          </div>
        </div>
      </main>
      )}

      <div className="hidden lg:block">
        <FloatingCreateButton onClick={openCreateModal} />
      </div>

      {/* Modal edit profil */}
      {editOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-[#111] border border-[#262626] rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Profil</h2>
              <button
                onClick={() => setEditOpen(false)}
                className="text-[#777] hover:text-white"
              >
                Tutup
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nama"
                className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 outline-none"
              />
              <input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Username"
                className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 outline-none"
              />
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 outline-none"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setAvatarFile(file);
                  setForm({ ...form, avatarUrl: URL.createObjectURL(file) });
                }}
                className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 outline-none"
              />
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Bio"
                rows={3}
                className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 outline-none resize-none"
              />
              {user?.provider !== "GOOGLE" && (
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Password baru (opsional)"
                  minLength={8}
                  className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 outline-none"
                />
              )}
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setEditOpen(false)}
                className="flex-1 border border-[#333] rounded-xl py-2 hover:bg-[#1a1a1a]"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateProfile}
                disabled={saving}
                className="flex-1 bg-white text-black font-bold rounded-xl py-2 disabled:opacity-60"
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      <CreatePostModal open={isCreateOpen} onClose={handleCreateClose} />
    </div>
    </div>
  );
}
