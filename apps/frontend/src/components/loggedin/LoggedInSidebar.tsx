import { Home, Plus, Heart, User, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../../stores/auth.store";

interface LoggedInSidebarProps {
  onCreateThread: () => void;
}

export default function LoggedInSidebar({
  onCreateThread,
}: LoggedInSidebarProps) {
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside className="hidden lg:flex flex-col w-[260px] px-5 py-6 border-r border-[#1f1f1f]">
      <h1 className="text-[42px] font-bold tracking-tight mb-10">@threads</h1>

      <nav className="space-y-1">
        <Link
          to="/home"
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-colors ${
            location.pathname === "/home"
              ? "bg-[#1f1f1f] text-white font-medium"
              : "hover:bg-[#111]"
          }`}
        >
          <Home size={22} />
          For you
        </Link>

        <button
          type="button"
          onClick={onCreateThread}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-[#111] transition-colors"
        >
          <Plus size={22} />
          New thread
        </button>

        <Link
          to="/activity"
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-colors ${
            location.pathname === "/activity"
              ? "bg-[#1f1f1f] text-white font-medium"
              : "hover:bg-[#111]"
          }`}
        >
          <Heart size={22} />
          Activity
        </Link>

        <Link
          to="/profile"
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-colors ${
            location.pathname === "/profile"
              ? "bg-[#1f1f1f] text-white font-medium"
              : "hover:bg-[#111]"
          }`}
        >
          <User size={22} />
          Profile
        </Link>
      </nav>

      <div className="mt-auto relative">
        <button
          type="button"
          onClick={() => setShowMenu((prev) => !prev)}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-[#111] transition-colors"
        >
          <Menu size={22} />
          More
        </button>

        {showMenu && (
          <div className="absolute bottom-16 left-0 w-full bg-[#181818] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-xl">
            <button
              type="button"
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
              className="w-full text-left px-4 py-3 text-red-400 hover:bg-[#222] transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}