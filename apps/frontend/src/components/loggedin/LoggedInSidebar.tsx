import { Home, Plus, Heart, User, Menu, ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../../stores/auth.store";

import ThreadsLogo from "../../assets/images/logo-threads-no-login.png";
import ThreadsLogoNoText from "../../assets/images/logo-threads-no-login-no-text.png";

interface LoggedInSidebarProps {
  onCreateThread: () => void;
}

export default function LoggedInSidebar({
  onCreateThread,
}: LoggedInSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
const isDetailPage = location.pathname.startsWith("/post/");

  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const logout = useAuthStore((state) => state.logout);

  return (
    <>
      {/* ========================= */}
      {/* DESKTOP SIDEBAR */}
      {/* ========================= */}
      <aside
  className="
    hidden
    lg:flex
    flex-col

    fixed
    left-0
    top-0

    w-[260px]
    h-screen

    border-r
    border-[#101010]
    overflow-hidden

    bg-[#101010]
    z-40
  "
>
        {/* SCROLLABLE CONTENT */}
        <div
          className="
            flex-1
            overflow-y-auto
            px-5
            py-6
          "
        >
          {/* TOP SECTION */}
          <div>
            <div className="flex items-center gap-4 mb-10 px-2">
              <div className="flex items-center">
                <img
                  src={ThreadsLogo}
                  alt="Threads"
                  className="w-[170px] object-contain"
                />
              </div>
            </div>

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
                className="
                  w-full
                  flex
                  items-center
                  gap-4
                  px-4
                  py-3
                  rounded-2xl
                  hover:bg-[#111]
                  transition-colors
                "
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
          </div>
        </div>

        {/* STICKY BOTTOM SECTION */}
        <div
          className="
            relative
            px-5
            py-4
            border-t
            border-[#101010]
            bg-[#101010]
            shrink-0
          "
        >
          <button
            type="button"
            onClick={() => setShowMenu((prev) => !prev)}
            className="
              w-full
              flex
              items-center
              gap-4
              px-4
              py-3
              rounded-2xl
              hover:bg-[#111]
              transition-colors
            "
          >
            <Menu size={22} />
            More
          </button>

          {showMenu && (
            <div
              className="
                absolute
                bottom-[78px]
                left-5
                right-5
                bg-[#181818]
                border
                border-[#2a2a2a]
                rounded-2xl
                overflow-hidden
                shadow-xl
              "
            >
              <button
                type="button"
                onClick={() => {
                  logout();
                  window.location.href = "/login";
                }}
                className="
                  w-full
                  text-left
                  px-4
                  py-3
                  text-red-400
                  hover:bg-[#222]
                  transition-colors
                "
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ========================= */}
      {/* MOBILE HEADER */}
      {/* ========================= */}
      <header
        className="
        lg:hidden
        fixed
        top-0
        left-0
        right-0
        z-50
        h-[56px]
        flex
        items-center
        justify-between
        px-4
        backdrop-blur-xl
        bg-[#101010]/70
        border-b
        border-white/[0.03]
      "
      >
        {/* Hamburger */}
        {isDetailPage ? (
  <button
    type="button"
    onClick={() => navigate(-1)}
    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#111] transition-colors"
  >
    <ArrowLeft size={24} />
  </button>
) : (
  <button
    type="button"
    onClick={() => setShowMobileMenu((prev) => !prev)}
    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#111] transition-colors"
  >
    <Menu size={24} />
  </button>
)}

        {/* Logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <img
            src={ThreadsLogoNoText}
            alt="Threads"
            className="h-7 w-7 object-contain"
          />
        </div>

        {/* Empty spacing */}
        {isDetailPage ? (
  <button
    type="button"
    onClick={() => setShowMobileMenu((prev) => !prev)}
    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#111] transition-colors"
  >
    <Menu size={24} />
  </button>
) : (
  <div className="w-10" />
)}
      </header>

      {/* ========================= */}
      {/* MOBILE DROPDOWN MENU */}
      {/* ========================= */}
      {showMobileMenu && (
        <>
          {/* Overlay transparan */}
<div
  className={`
  lg:hidden
  fixed
  top-[62px]
  ${isDetailPage ? "right-4" : "left-4"}
  z-50
  w-[180px]
  bg-[#262626]
  border
  border-[#333]
  rounded-2xl
  shadow-2xl
  overflow-hidden
`}
>
            <button
              type="button"
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
              className="
          w-full
          text-left
          px-4
          py-3

          text-red-400
          text-[14px]

          hover:bg-[#303030]
          transition-colors
        "
            >
              Logout
            </button>
          </div>
        </>
      )}

      {/* ========================= */}
      {/* MOBILE BOTTOM NAVBAR */}
      {/* ========================= */}
      <nav
        className="
        lg:hidden
        fixed
        bottom-0
        left-0
        right-0
        z-50
        h-[64px]
        flex
        items-center
        justify-around
        backdrop-blur-xl
        bg-[#0A0A0A]/70
        border-t
        border-white/[0.03]
  "
      >
        {/* Home */}
        <Link
          to="/home"
          className={`
      flex
      flex-col
      items-center
      justify-center
      gap-1
      w-[70px]
      transition-opacity
      ${location.pathname === "/home" ? "opacity-100" : "opacity-50"}
    `}
        >
          <Home size={24} />
        </Link>

        {/* Create Thread */}
        <button
          type="button"
          onClick={onCreateThread}
          className="
      flex
      flex-col
      items-center
      justify-center
      gap-1
      w-[70px]
      transition-opacity
      opacity-50
      active:scale-95
    "
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>

        {/* Activity */}
        <Link
          to="/activity"
          className={`
      flex
      flex-col
      items-center
      justify-center
      gap-1
      w-[70px]
      transition-opacity
      ${location.pathname === "/activity" ? "opacity-100" : "opacity-50"}
    `}
        >
          <Heart size={24} />
        </Link>

        {/* Profile */}
        <Link
          to="/profile"
          className={`
      flex
      flex-col
      items-center
      justify-center
      gap-1
      w-[70px]
      transition-opacity
      ${location.pathname === "/profile" ? "opacity-100" : "opacity-50"}
    `}
        >
          <User size={24} />
        </Link>
      </nav>
    </>
  );
}
