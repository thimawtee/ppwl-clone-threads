import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { useAuthStore } from "../stores/authStore";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("siki@test.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const result = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!result.success) {
      setMessage(result.message || "Login gagal");
      return;
    }

    setAuth(result.data.user, result.data.token);
    setAuth(result.data.user, result.data.token);
toast.success(`Selamat datang, ${result.data.user.name}!`);
navigate("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md border border-zinc-800 rounded-2xl p-6 space-y-4"
      >
        <div>
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-zinc-400 mt-1">Masuk ke Threads Clone</p>
        </div>

        {message && (
          <p className="bg-red-500/10 border border-red-500 text-red-300 p-3 rounded-xl">
            {message}
          </p>
        )}

        <div className="space-y-2">
          <label className="text-sm text-zinc-300">Email</label>
          <input
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@test.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-zinc-300">Password</label>
          <input
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 outline-none focus:border-white"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-white text-black font-semibold rounded-xl py-3 hover:bg-zinc-200 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}