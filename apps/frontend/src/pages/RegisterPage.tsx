import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = async () => {
    setLoading(true)
    setError("")
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
        form
      )
      navigate("/login")
    } catch (err: any) {
      setError(err.response?.data?.message || "Registrasi gagal")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#101010" }}>
      <div className="w-full max-w-sm p-8 rounded-2xl" style={{ backgroundColor: "#1a1a1a", border: "1px solid #2d2d2d" }}>
        
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: "#f5f5f5" }}>Threads</h1>
          <p className="mt-2 text-sm" style={{ color: "#a0a0a0" }}>Buat akun baru</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm text-red-400" style={{ backgroundColor: "#2d1a1a" }}>
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-3">
          {[
            { name: "name", placeholder: "Nama lengkap", type: "text" },
            { name: "username", placeholder: "Username", type: "text" },
            { name: "email", placeholder: "Email", type: "email" },
            { name: "password", placeholder: "Password", type: "password" },
          ].map((field) => (
            <input
              key={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={form[field.name as keyof typeof form]}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ backgroundColor: "#242424", color: "#f5f5f5", border: "1px solid #2d2d2d" }}
            />
          ))}
        </div>

        {/* Tombol Register */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full mt-4 py-3 rounded-xl font-semibold text-sm"
          style={{ backgroundColor: "#ffffff", color: "#101010" }}
        >
          {loading ? "Memuat..." : "Daftar"}
        </button>

        {/* Link Login */}
        <p className="text-center text-sm mt-6" style={{ color: "#a0a0a0" }}>
          Sudah punya akun?{" "}
          <Link to="/login" style={{ color: "#ffffff" }} className="font-semibold">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  )
}