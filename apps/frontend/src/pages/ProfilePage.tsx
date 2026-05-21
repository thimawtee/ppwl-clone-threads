import { useState, useEffect } from "react";
import { toast } from "sonner";
import LoggedInSidebar from "../components/loggedin/LoggedInSidebar";
import { API_URL } from "../services/api";
import {
  BarChart3,
  Square as Instagram,
  MoreHorizontal,
  SquarePen,
  UserPlus,
  Pen,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";

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

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    avatarUrl: "",
    password: "",
  });
  const setAuth = useAuthStore((state) => state.setAuth);
  const authUser = useAuthStore((state) => state.user);
const token = useAuthStore((state) => state.token);

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
    password: "",
  });
}, [authUser]);

  const defaultAvatar =
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";

  const userAvatar = user?.avatarUrl || defaultAvatar;

  async function handleUpdateProfile() {

    if (!token) {
      toast.error("Silakan login terlebih dahulu.");
      return;
    }

    try {
      setSaving(true);

      const body: {
        name: string;
        username: string;
        email: string;
        avatarUrl: string | null;
        password?: string;
      } = {
        name: form.name,
        username: form.username,
        email: form.email,
        avatarUrl: form.avatarUrl || null,
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
      <LoggedInSidebar />

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

                <p className="text-sm text-[#777777] mt-5">0 pengikut</p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <img
                  src={userAvatar}
                  alt="Avatar"
                  className="w-[72px] h-[72px] rounded-full object-cover"
                />

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
              <img
                src={userAvatar}
                alt="Mini Avatar"
                className="w-9 h-9 rounded-full object-cover opacity-80"
              />

              <input
                type="text"
                placeholder="Apa yang baru?"
                className="bg-transparent text-sm text-white placeholder-[#777777] outline-none flex-1"
              />
            </div>

            <button className="border border-[#262626] px-4 py-1.5 rounded-xl text-sm font-semibold text-white bg-black hover:bg-[#121212] transition-colors">
              Kirim
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

                <button className="w-full bg-white text-black text-xs font-bold py-2 rounded-xl mt-4 hover:bg-[#e6e6e6] transition-colors">
                  Create
                </button>
              </div>

              <div className="bg-[#121212] border border-[#1f1f1f] rounded-2xl p-4 flex flex-col items-center text-center justify-between min-h-[180px] md:min-h-[200px]">
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-full border border-[#262626] flex items-center justify-center mb-3">
                    <UserPlus size={18} className="text-white" />
                  </div>

                  <h4 className="text-xs font-bold text-white mb-1">
                    Follow 10 profiles
                  </h4>

                  <p className="text-[11px] text-[#777777] leading-normal px-1">
                    Fill your feed with threads that interest you.
                  </p>
                </div>

                <button className="w-full bg-white text-black text-xs font-bold py-2 rounded-xl mt-4 hover:bg-[#e6e6e6] transition-colors">
                  See profiles
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

                <button className="w-full bg-white text-black text-xs font-bold py-2 rounded-xl mt-4 hover:bg-[#e6e6e6] transition-colors">
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

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
                value={form.avatarUrl}
                onChange={(e) =>
                  setForm({ ...form, avatarUrl: e.target.value })
                }
                placeholder="Avatar URL"
                className="bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 outline-none"
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
    </div>
  );
}