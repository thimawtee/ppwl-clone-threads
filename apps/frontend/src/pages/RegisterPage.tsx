import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../services/api";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleRegister() {
  setLoading(true);
  setError("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!form.name || !form.username || !form.email || !form.password) {
    setError("Semua field wajib diisi.");
    setLoading(false);
    return;
  }

  if (!emailRegex.test(form.email)) {
    setError("Format email tidak valid.");
    setLoading(false);
    return;
  }

  if (form.password.length < 8) {
    setError("Password minimal 8 karakter.");
    setLoading(false);
    return;
  }

  try {
    const res = await axios.post(`${API_URL}/auth/register`, form);

    if (!res.data.success) {
      throw new Error(res.data.message || "Registrasi gagal");
    }

    navigate("/login");
  } catch (err: any) {
    setError(
      err.response?.data?.message ||
        err.message ||
        "Registrasi gagal"
    );
  } finally {
    setLoading(false);
  }
}

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleRegister();
  }

  return (
    <div className="min-h-screen bg-[#101010] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-[#1a1a1a] border border-[#2d2d2d] rounded-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Threads</h1>
          <p className="mt-2 text-sm text-[#a0a0a0]">
            Buat akun baru
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm text-red-400 bg-red-500/10 border border-red-500/20">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Nama lengkap"
            value={form.name}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-[#242424] text-white border border-[#2d2d2d]"
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-[#242424] text-white border border-[#2d2d2d]"
          />

          <input
  type="email"
  name="email"
  placeholder="Email"
  value={form.email}
  onChange={handleChange}
  onKeyDown={handleKeyDown}
  required
  className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-[#242424] text-white border border-[#2d2d2d]"
/>

          <input
  type="password"
  name="password"
  placeholder="Password"
  value={form.password}
  onChange={handleChange}
  onKeyDown={handleKeyDown}
  minLength={8}
  className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-[#242424] text-white border border-[#2d2d2d]"
/>
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full mt-4 py-3 rounded-xl font-semibold text-sm bg-white text-black disabled:opacity-60"
        >
          {loading ? "Memuat..." : "Daftar"}
        </button>

        <p className="text-center text-sm mt-6 text-[#a0a0a0]">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-white font-semibold">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}