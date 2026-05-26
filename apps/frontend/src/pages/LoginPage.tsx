import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "../services/api";
import { useAuthStore } from "../stores/auth.store";
import logoThreads from "../assets/images/logo-threads-no-login-no-text.png";

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

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const isAuthenticated = useAuthStore(
  (state) => state.isAuthenticated
);

  const [email, setEmail] = useState("budi@test.com");
  const [password, setPassword] = useState("12345678");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (isAuthenticated) {
    navigate("/home");
  }
}, [isAuthenticated, navigate]);

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
    <div
      style={{
        minHeight: "100vh",
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
            display: "flex",
            justifyContent: "center",
            marginBottom: "32px",
            color: "#f5f5f5",
          }}
        >
          <ThreadsLogo />
        </div>

        <p
          style={{
            textAlign: "center",
            color: "#f5f5f5",
            fontSize: "15px",
            marginBottom: "20px",
            fontWeight: 500,
          }}
        >
          Log in with your account
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

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: "12px",
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
          {loading ? "Logging in..." : "Log in"}
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            margin: "20px 0",
          }}
        >
          <div style={{ flex: 1, height: "1px", backgroundColor: "#2d2d2d" }} />
          <span style={{ color: "#6b6b6b", fontSize: "13px" }}>or</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#2d2d2d" }} />
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const credential = credentialResponse.credential;

                if (!credential) {
                  throw new Error("Credential Google tidak ditemukan.");
                }

                const decoded: any = jwtDecode(credential);

                const res = await axios.post(`${API_URL}/auth/google`, {
                  name: decoded.name,
                  email: decoded.email,
                  avatarUrl: decoded.picture,
                });

                if (!res.data.success) {
                  throw new Error(res.data.message || "Google login gagal.");
                }

                const user = res.data.data.user;
                const token = res.data.data.token;

                setAuth(user, token);
                toast.success(`Selamat datang, ${user.name}!`);
                navigate("/home");
              } catch (error: any) {
                toast.error(error.message || "Google login gagal.");
              }
            }}
            onError={() => {
              toast.error("Google login gagal.");
            }}
          />
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "14px",
            color: "#777",
          }}
        >
          Belum punya akun?{" "}
          <Link to="/register" style={{ color: "#fff", fontWeight: 600 }}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}