import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../services/api";
import logoThreads from "../assets/images/logo-threads-no-login-no-text.png";
import { toast } from "sonner";

function ThreadsLogo() {
  return (
    <img
      src={logoThreads}
      alt="Threads Logo"
      className="w-12 h-12 object-contain"
    />
  );
}

function BGText({ side }: { side: "left" | "right" }) {
  const words = ["THREATS", "THREATS", "THREATS"];

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

      toast.success("Akun berhasil dibuat!, Silakan login dengan email dan password yang sudah didaftarkan.");
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