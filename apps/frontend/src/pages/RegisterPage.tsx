import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../services/api";

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

function BGText({ side }: { side: "left" | "right" }) {
  const words = ["THREADS", "THREADS", "THREADS"];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        [side]: 0,
        width: "180px",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          animation: `scrollText${side} 18s linear infinite`,
        }}
      >
        {words.map((word, i) => (
          <span
            key={i}
            style={{
              fontSize: "72px",
              fontWeight: 900,
              color: "transparent",
              WebkitTextStroke: "1.5px rgba(255,255,255,0.08)",
              letterSpacing: "-2px",
              lineHeight: 1,
              whiteSpace: "nowrap",
              transform: side === "right" ? "rotate(180deg)" : undefined,
              writingMode: "vertical-rl",
              userSelect: "none",
            }}
          >
            {word}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes scrollTextleft {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }

        @keyframes scrollTextright {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
      `}</style>
    </div>
  );
}
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

    if (
      !form.name.trim() ||
      !form.username.trim() ||
      !form.email.trim() ||
      !form.password.trim()
    ) {
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
      const res = await axios.post(
        `${API_URL}/auth/register`,
        form
      );

      if (!res.data.success) {
        throw new Error(
          res.data.message || "Registrasi gagal"
        );
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

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter") {
      handleRegister();
    }
  }

  return (
  <div
    style={{
      height: "100vh",
      backgroundColor: "#101010",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily:
        "system-ui, -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif",
      position: "relative",
      overflow: "hidden",
      color: "#fff",
    }}
  >
    <BGText side="left" />
    <BGText side="right" />

    <div
      style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        maxWidth: "400px",
        padding: "0 16px",
      }}
    >
      <div
  style={{
    padding: "40px 32px",
  }}
>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
            color: "#f5f5f5",
          }}
        >
          <ThreadsLogo />
        </div>

        <p
          style={{
            textAlign: "center",
            color: "#fff",
            marginBottom: "28px",
            fontSize: "16px",
          }}
        >
          Create your new account
        </p>

        {error && (
          <div
            style={{
              marginBottom: "12px",
              padding: "10px 14px",
              borderRadius: "12px",
              backgroundColor: "rgba(239,68,68,0.1)",
              color: "#ef4444",
              fontSize: "13px",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Nama lengkap"
            value={form.name}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid #2d2d2d",
              backgroundColor: "#1a1a1a",
              color: "#f5f5f5",
              fontSize: "15px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid #2d2d2d",
              backgroundColor: "#1a1a1a",
              color: "#f5f5f5",
              fontSize: "15px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid #2d2d2d",
              backgroundColor: "#1a1a1a",
              color: "#f5f5f5",
              fontSize: "15px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            minLength={8}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: "12px",
              border: "1px solid #2d2d2d",
              backgroundColor: "#1a1a1a",
              color: "#f5f5f5",
              fontSize: "15px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: "14px",
            padding: "14px",
            borderRadius: "12px",
            backgroundColor: loading ? "#cccccc" : "#ffffff",
            color: "#101010",
            fontSize: "15px",
            fontWeight: 700,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Memuat..." : "Daftar"}
        </button>

        <div
          style={{
            textAlign: "center",
            marginTop: "22px",
            fontSize: "14px",
            color: "#777",
          }}
        >
          Sudah punya akun?{" "}
          <Link
            to="/login"
            style={{
              color: "#fff",
              fontWeight: 600,
            }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  </div>
);
}