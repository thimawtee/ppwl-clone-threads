import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { useAuthStore } from "../stores/auth.store"

// Threads logo SVG
function ThreadsLogo() {
  return (
    <svg aria-label="Threads" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor">
      <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 96C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.698 128.946 98.4405 129.507Z" />
    </svg>
  )
}

// Google logo SVG
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

// Animated background text
function BGText({ side }: { side: "left" | "right" }) {
  const words = ["THREADS", "THREADS", "THREADS"]
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
        gap: "0px",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {[...Array(3)].map((_, gi) => (
        <div
          key={gi}
          style={{
            display: "flex",
            flexDirection: "column",
            animation: `scrollText${side} ${18 + gi * 2}s linear infinite`,
            animationDirection: gi % 2 === 0 ? "normal" : "reverse",
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
      ))}
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
  )
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        { email, password }
      )
      setAuth(res.data.user, res.data.accessToken)
      navigate("/")
    } catch (err: any) {
      setError(err.response?.data?.message || "Login gagal. Periksa email dan password.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin()
  }

  // Simulasi Google login — belum konek ke Google OAuth sungguhan
  const handleGoogleLogin = () => {
    setGoogleLoading(true)
    setTimeout(() => {
      setGoogleLoading(false)
      setError("Login dengan Google belum tersedia. Gunakan email & password.")
    }, 1200)
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#101010",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated BG */}
      <BGText side="left" />
      <BGText side="right" />

      {/* Form container */}
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "400px", padding: "0 16px" }}>

        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px", color: "#f5f5f5" }}>
          <ThreadsLogo />
        </div>

        {/* Title */}
        <p style={{ textAlign: "center", color: "#f5f5f5", fontSize: "15px", marginBottom: "20px", fontWeight: 500 }}>
          Log in with your Instagram account
        </p>

        {/* Error */}
        {error && (
          <div style={{
            marginBottom: "12px",
            padding: "10px 14px",
            borderRadius: "12px",
            backgroundColor: "rgba(239,68,68,0.1)",
            color: "#ef4444",
            fontSize: "13px",
            border: "1px solid rgba(239,68,68,0.2)"
          }}>
            {error}
          </div>
        )}

        {/* Inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <input
            type="text"
            placeholder="Username, phone or email"
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
            onFocus={(e) => e.target.style.borderColor = "#3a3a3a"}
            onBlur={(e) => e.target.style.borderColor = "#2d2d2d"}
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
            onFocus={(e) => e.target.style.borderColor = "#3a3a3a"}
            onBlur={(e) => e.target.style.borderColor = "#2d2d2d"}
          />
        </div>

        {/* Login Button */}
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
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => { if (!loading) (e.target as HTMLElement).style.opacity = "0.9" }}
          onMouseLeave={(e) => { if (!loading) (e.target as HTMLElement).style.opacity = "1" }}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        {/* Forgot password */}
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <a href="#" style={{ color: "#a0a0a0", fontSize: "14px", textDecoration: "none" }}>
            Forgot password?
          </a>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#2d2d2d" }} />
          <span style={{ color: "#6b6b6b", fontSize: "13px" }}>or</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#2d2d2d" }} />
        </div>

        {/* Continue with Google */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 16px",
            borderRadius: "12px",
            border: "1px solid #2d2d2d",
            backgroundColor: "transparent",
            cursor: googleLoading ? "not-allowed" : "pointer",
            transition: "background-color 0.2s",
            marginBottom: "8px",
          }}
          onMouseEnter={(e) => { if (!googleLoading) (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)") }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent" }}
        >
          {/* Google icon */}
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <GoogleIcon />
          </div>
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ color: googleLoading ? "#6b6b6b" : "#f5f5f5", fontSize: "14px", fontWeight: 600 }}>
              {googleLoading ? "Menghubungkan..." : "Continue with Google"}
            </div>
          </div>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#6b6b6b">
            <path d="M9 18l6-6-6-6" stroke="#6b6b6b" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Continue with Instagram */}
        <Link
          to="/register"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 16px",
            borderRadius: "12px",
            border: "1px solid #2d2d2d",
            backgroundColor: "transparent",
            textDecoration: "none",
            cursor: "pointer",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          {/* Instagram gradient icon */}
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#f5f5f5", fontSize: "14px", fontWeight: 600 }}>Continue with Instagram</div>
          </div>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#6b6b6b">
            <path d="M9 18l6-6-6-6" stroke="#6b6b6b" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

        {/* Footer */}
        <p style={{ textAlign: "center", color: "#6b6b6b", fontSize: "12px", marginTop: "32px" }}>
          © 2026 ·{" "}
          <a href="#" style={{ color: "#6b6b6b", textDecoration: "none" }}>Threads Terms</a>
          {" · "}
          <a href="#" style={{ color: "#6b6b6b", textDecoration: "none" }}>Privacy Policy</a>
          {" · "}
          <a href="#" style={{ color: "#6b6b6b", textDecoration: "none" }}>Cookies Policy</a>
          {" · "}
          <a href="#" style={{ color: "#6b6b6b", textDecoration: "none" }}>Report a problem</a>
        </p>
      </div>

      {/* QR Code placeholder */}
      <div style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}>
        <span style={{ color: "#6b6b6b", fontSize: "12px" }}>Scan to get the app</span>
        <div style={{
          width: "80px",
          height: "80px",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "6px",
        }}>
          <svg viewBox="0 0 21 21" width="68" height="68" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="9" height="9" rx="1" fill="#000"/>
            <rect x="1" y="1" width="7" height="7" rx="0.5" fill="#fff"/>
            <rect x="2" y="2" width="5" height="5" rx="0.5" fill="#000"/>
            <rect x="12" y="0" width="9" height="9" rx="1" fill="#000"/>
            <rect x="13" y="1" width="7" height="7" rx="0.5" fill="#fff"/>
            <rect x="14" y="2" width="5" height="5" rx="0.5" fill="#000"/>
            <rect x="0" y="12" width="9" height="9" rx="1" fill="#000"/>
            <rect x="1" y="13" width="7" height="7" rx="0.5" fill="#fff"/>
            <rect x="2" y="14" width="5" height="5" rx="0.5" fill="#000"/>
            <rect x="11" y="11" width="2" height="2" fill="#000"/>
            <rect x="14" y="11" width="2" height="2" fill="#000"/>
            <rect x="17" y="11" width="2" height="2" fill="#000"/>
            <rect x="11" y="14" width="2" height="2" fill="#000"/>
            <rect x="14" y="14" width="2" height="2" fill="#000"/>
            <rect x="17" y="14" width="2" height="2" fill="#000"/>
            <rect x="11" y="17" width="2" height="2" fill="#000"/>
            <rect x="14" y="17" width="2" height="2" fill="#000"/>
            <rect x="17" y="17" width="2" height="2" fill="#000"/>
          </svg>
        </div>
      </div>
    </div>
  )
}