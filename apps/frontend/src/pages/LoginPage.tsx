import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("budi@test.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const result = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (result.success) {
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));
      navigate("/home");
    } else {
      alert(result.message || "Login gagal");
    }
  }

  return (
    <div className="min-h-screen bg-[#101010] text-white flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-[#181818] border border-[#2a2a2a] rounded-3xl p-6 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">
          Login Threads Clone
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full bg-[#101010] border border-[#333] rounded-xl px-4 py-3 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full bg-[#101010] border border-[#333] rounded-xl px-4 py-3 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black rounded-xl py-3 font-semibold disabled:opacity-60"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}