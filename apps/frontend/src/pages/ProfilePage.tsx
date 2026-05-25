import { useState, useEffect } from "react";
import { toast } from "sonner";
import LoggedInSidebar from "../components/loggedin/LoggedInSidebar";
import { API_URL } from "../services/api";
import {
  BarChart3,
  Square as Instagram,
  MoreHorizontal,
  SquarePen,
  Pen,
  Camera,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import FloatingCreateButton from "@/components/loggedin/FloatingCreateButton";
import CreatePostModal from "@/components/CreatePostModal";

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email?: string;
  avatarUrl: string | null;
  bio?: string | null;
  provider?: "EMAIL" | "GOOGLE";
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

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

  const userAvatar = user?.avatarUrl || "";

  async function handleUpdateProfile() {

    if (!token) {
      toast.error("Silakan login terlebih dahulu.");
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
      const cleanBase64 = result.split(",")[1];
      resolve(cleanBase64);
    };

    reader.onerror = reject;
    reader.readAsDataURL(avatarFile);
  });

  const uploadRes = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
    <div className="min-h-screen bg-black text-white flex">
      <LoggedInSidebar onCreateThread={openCreateModal} />

      <main className="flex-1 flex justify-center px-3 md:px-4 py-4 md:py-6 pb-24">
        <div className="w-full max-w-[620px] border border-[#262626] rounded-[20px] md:rounded-[24px] overflow-hidden bg-black flex flex-col">
          <div className="px-4 md:px-6 pt-5 pb-3 flex justify-between items-center">
            <span className="text-base font-semibold tracking-wide">
              {user?.username || "loading..."}
            </span>

            <button className="text-[#777777] hover:text-white transition-colors">
              <MoreHorizontal size={22} />
            </button>
          </div>

          <div className="px-4 md:px-6 pt-4 pb-2">
            <div className="flex justify-between items-start gap-4">
              <div>
  <h2 className="text-2xl font-bold tracking-tight text-white">
    {user?.name || "Loading..."}
  </h2>

  <p className="text-sm text-[#777777] mt-0.5">
    {user?.username ? `@${user.username}` : ""}
  </p>

  {user?.bio && (
    <p className="text-sm text-white mt-4 max-w-[320px] leading-relaxed">
      {user.bio}
    </p>
  )}

  <p className="text-sm text-[#777777] mt-5">0 pengikut</p>
</div>

              <div className="flex flex-col items-end gap-3">
                <div className="w-[72px] h-[72px] rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-green-400 flex items-center justify-center">
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
            <div className="min-w-[140px] flex-1 text-center pb-3 text-[#777777] cursor-pointer hover:text-white transition-colors">
              Postingan Ulang
            </div>
          </div>

          <div className="px-4 md:px-6 py-4 flex items-center justify-between border-b border-[#1f1f1f]">
  <div className="flex items-center gap-3 flex-1">
    <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-green-400 flex items-center justify-center shrink-0">
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

          <div className="px-4 md:px-6 py-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-white">
                Selesaikan profil Anda
              </h3>

              <span className="text-xs text-[#777777] font-medium">
                3 tersisa
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-[#121212] border border-[#1f1f1f] rounded-2xl p-4 flex flex-col items-center text-center justify-between min-h-[180px] md:min-h-[200px]">
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full border border-[#262626] flex items-center justify-center mb-3">
                    <SquarePen size={18} className="text-white" />
                  </div>

                  <h4 className="text-xs font-bold text-white mb-1">
                    Create thread
                  </h4>

                  <p className="text-[11px] text-[#777777] leading-normal px-1">
                    Say what's on your mind or share a recent highlight.
                  </p>
                </div>

                <button
  onClick={openCreateModal}
  className="w-full bg-white text-black text-xs font-bold py-2 rounded-xl mt-4 hover:bg-[#e6e6e6] transition-colors"
>
  Create
</button>
              </div>

              <div className="bg-[#121212] border border-[#1f1f1f] rounded-2xl p-4 flex flex-col items-center text-center justify-between min-h-[180px] md:min-h-[200px]">
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full border border-[#262626] flex items-center justify-center mb-3">
                    <Camera size={18} className="text-white" />
                  </div>

                  <h4 className="text-xs font-bold text-white mb-1">
                    Add profile photo
                  </h4>

                  <p className="text-[11px] text-[#777777] leading-normal px-1">
                    Make it easy for people to recognize you.
                  </p>
                </div>

                <button
  onClick={() => setEditOpen(true)}
  className="w-full bg-white text-black text-xs font-bold py-2 rounded-xl mt-4 hover:bg-[#e6e6e6] transition-colors"
>
  Add
</button>
              </div>

              <div className="bg-[#121212] border border-[#1f1f1f] rounded-2xl p-4 flex flex-col items-center text-center justify-between min-h-[180px] md:min-h-[200px]">
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full border border-[#262626] flex items-center justify-center mb-3">
                    <Pen size={16} className="text-white" />
                  </div>

                  <h4 className="text-xs font-bold text-white mb-1">
                    Add bio
                  </h4>

                  <p className="text-[11px] text-[#777777] leading-normal px-1">
                    Introduce yourself and tell people what you're into.
                  </p>
                </div>

                <button
  onClick={() => setEditOpen(true)}
  className="w-full bg-white text-black text-xs font-bold py-2 rounded-xl mt-4 hover:bg-[#e6e6e6] transition-colors"
>
  Add
</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FloatingCreateButton onClick={openCreateModal} />

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
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Nama"
                className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 outline-none"
              />

              <input
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
                placeholder="Username"
                className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 outline-none"
              />

              <input
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
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
    setForm({
      ...form,
      avatarUrl: URL.createObjectURL(file),
    });
  }}
  className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 outline-none"
/>

              <textarea
  value={form.bio}
  onChange={(e) =>
    setForm({ ...form, bio: e.target.value })
  }
  placeholder="Bio"
  rows={3}
  className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 outline-none resize-none"
/>

              {user?.provider !== "GOOGLE" && (
  <input
    type="password"
    value={form.password}
    onChange={(e) => setForm({ ...form, password: e.target.value })}
    placeholder="Password baru (opsional)"
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
      <CreatePostModal
  open={isCreateOpen}
  onClose={() => setIsCreateOpen(false)}
/>
    </div>
  );
}