import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "../services/api";
import { useAuthStore } from "../stores/auth.store";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function ThreadsLogo() {
  return (
    <svg
      aria-label="Threads"
      viewBox="0 0 192 192"
      width="48"
      height="48"
      fill="currentColor"
    >
      <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 96C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883Z" />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();

  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("budi@test.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      if (!res.data.success) {
        throw new Error(res.data.message || "Login gagal.");
      }

      const user = res.data.data.user;
      const token = res.data.data.token;

      setAuth(user, token);

      toast.success(`Selamat datang, ${user.name}!`);

      navigate("/home");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login gagal. Periksa email dan password."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleLogin();
  }

  return (
    <div className="min-h-screen bg-[#101010] text-white flex items-center justify-center relative overflow-hidden px-4">
      <div className="w-full max-w-[400px] relative z-10">
        <div className="flex justify-center mb-8">
          <ThreadsLogo />
        </div>

        <p className="text-center text-[15px] mb-5 font-medium">
          Log in with your account
        </p>

        {error && (
          <div className="mb-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-3.5 rounded-xl bg-[#1a1a1a] border border-[#2d2d2d] outline-none text-white"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-3.5 rounded-xl bg-[#1a1a1a] border border-[#2d2d2d] outline-none text-white"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-3 py-3.5 rounded-xl bg-white text-black font-bold disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <div className="mt-4 flex justify-center">
  <GoogleLogin
    onSuccess={async (credentialResponse) => {
      try {
        const decoded: any = jwtDecode(
          credentialResponse.credential!
        );

        const res = await axios.post(
          `${API_URL}/auth/google`,
          {
            name: decoded.name,
            email: decoded.email,
            avatarUrl: decoded.picture,
          }
        );

        if (!res.data.success) {
          throw new Error(
            res.data.message || "Google login gagal."
          );
        }

        const user = res.data.data.user;
        const token = res.data.data.token;

        setAuth(user, token);

        toast.success(
          `Selamat datang, ${user.name}!`
        );

        navigate("/home");
      } catch (error: any) {
        toast.error(
          error.message || "Google login gagal."
        );
      }
    }}
    onError={() => {
      toast.error("Google login gagal.");
    }}
  />
</div>

        <div className="text-center mt-5 text-sm text-[#777]">
          Belum punya akun?{" "}
          <Link to="/register" className="text-white font-semibold">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}