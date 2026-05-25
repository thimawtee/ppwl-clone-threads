import { Link } from "react-router-dom";
import logoThreads from "../assets/images/logo-threads-no-login.png";
import {
  Home,
  Plus,
  Heart,
  User,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────

interface PostUser {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
}

// ─── Helpers ───────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Avatar ────────────────────────────────────────────────────────────

function Avatar({ user, size = 36 }: { user: PostUser; size?: number }) {
  const colors = [
    "bg-violet-600",
    "bg-blue-600",
    "bg-emerald-600",
    "bg-amber-600",
    "bg-rose-600",
    "bg-cyan-600",
    "bg-pink-600",
    "bg-indigo-600",
  ];

  const color = colors[user.id.charCodeAt(0) % colors.length];

  return (
    <div
      className="relative shrink-0 rounded-full overflow-hidden"
      style={{ width: size, height: size }}
    >
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={user.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div
          className={`w-full h-full ${color} flex items-center justify-center text-white font-semibold`}
          style={{ fontSize: size * 0.36 }}
        >
          {getInitials(user.name)}
        </div>
      )}
    </div>
  );
}

// ─── Desktop Sidebar ───────────────────────────────────────────────────

interface SidebarProps {
  currentUser: PostUser | null;
  activePage: string;
  onNav: (page: string) => void;
}

export function DesktopSidebar({
  currentUser,
  activePage,
  onNav,
}: SidebarProps) {
  const navItems = [
    { id: "home", path: "/", icon: Home },
    { id: "create", path: "/login", icon: Plus },
    { id: "notifications", path: "/login", icon: Heart },
    { id: "profile", path: "/login", icon: User },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-20 border-r border-[#1e1e1e] sticky top-0 h-screen bg-black">
      {/* Logo */}
      <div className="pl-5 pt-6 pb-8">
        <img
          src={logoThreads}
          alt="Threads"
          className="w-9 h-9 object-contain"
        />
      </div>

      {/* Nav */}
      <div className="flex flex-col gap-2 px-3">
        {navItems.map(({ id, path, icon: Icon }) => {
          const isActive = activePage === id;

          const itemClass = `w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 ${
            isActive
              ? "bg-[#1f1f1f] text-white"
              : "text-[#d0d0d0] hover:bg-[#151515] hover:text-white"
          }`;

          if (id === "create") {
            return (
              <button
                key={id}
                onClick={() => onNav(id)}
                className={itemClass}
              >
                <Icon size={30} strokeWidth={2.2} />
              </button>
            );
          }

          return (
            <Link
              key={id}
              to={path}
              onClick={() => onNav(id)}
              className={itemClass}
            >
              {id === "profile" && currentUser ? (
                <div
                  className={`rounded-full overflow-hidden ${
                    isActive ? "ring-2 ring-white" : ""
                  }`}
                >
                  <Avatar user={currentUser} size={28} />
                </div>
              ) : (
                <Icon size={30} strokeWidth={2.2} />
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

// ─── Mobile Bottom Nav ─────────────────────────────────────────────────

export function MobileBottomNav({
  currentUser,
  activePage,
  onNav,
}: SidebarProps) {
  const navItems = [
    { id: "home", path: "/", icon: Home },
    { id: "create", path: "/login", icon: Plus },
    { id: "notifications", path: "/login", icon: Heart },
    { id: "profile", path: "/login", icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#101010]/90 backdrop-blur-xl border-t border-[#1e1e1e] flex items-center justify-around px-2 py-2 safe-area-pb">
      {navItems.map(({ id, path, icon: Icon }) => {
        const isActive = activePage === id;

        const itemClass = `flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors ${
          isActive ? "text-white" : "text-[#555] hover:text-[#aaa]"
        }`;

        if (id === "create") {
          return (
            <button
              key={id}
              onClick={() => onNav(id)}
              className={itemClass}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 1.8} />
            </button>
          );
        }

        return (
          <Link
            key={id}
            to={path}
            onClick={() => onNav(id)}
            className={itemClass}
          >
            {id === "profile" && currentUser ? (
              <div
                className={`rounded-full overflow-hidden ${
                  isActive ? "ring-2 ring-white" : ""
                }`}
              >
                <Avatar user={currentUser} size={24} />
              </div>
            ) : (
              <Icon size={24} strokeWidth={isActive ? 2.5 : 1.8} />
            )}
          </Link>
        );
      })}
    </nav>
  );
}