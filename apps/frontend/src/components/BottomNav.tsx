import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export default function BottomNav() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const active = (path: string) =>
    location.pathname === path ? "text-white" : "text-zinc-500";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-black/90 backdrop-blur md:hidden">
      <div className="flex items-center justify-around py-3 text-2xl">
        <Link to="/" className={active("/")}>
          🏠
        </Link>

        <Link to="/" className="text-zinc-500">
          🔍
        </Link>

        <Link to="/" className="text-zinc-500">
          ✍️
        </Link>

        {isAuthenticated ? (
  <Link to="/profile" className={active("/profile")}>
    👤
  </Link>
) : (
  <Link to="/login" className={active("/login")}>
    👤
  </Link>
)}
      </div>
    </div>
  );
}