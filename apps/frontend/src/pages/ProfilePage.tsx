import { useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../services/api";
import { useAuthStore } from "../stores/authStore";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth);

  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [password, setPassword] = useState("");

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    const result = await apiFetch("/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        username,
        email,
        avatarUrl,
        bio,
        password: password || undefined,
      }),
    });

    if (result.success) {
      setAuth(result.data, token!);
      alert("Profile berhasil diperbarui");
    } else {
      alert(result.message || "Gagal update profile");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="sticky top-0 border-b border-zinc-800 bg-black/80 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between">
          <Link to="/" className="text-zinc-400 hover:text-white">
            ← Beranda
          </Link>
          <h1 className="font-bold">Edit Profile</h1>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="max-w-2xl mx-auto p-4 space-y-4">
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover border border-zinc-700"
          />
        )}

        <input
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama"
        />

        <input
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />

        <input
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />

        <input
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="Avatar URL"
        />

        <textarea
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none min-h-[100px]"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio"
        />

        <input
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password baru, kosongkan jika tidak diganti"
        />

        <button className="w-full bg-white text-black rounded-xl py-3 font-semibold">
          Simpan Profile
        </button>
      </form>
    </div>
  );
}