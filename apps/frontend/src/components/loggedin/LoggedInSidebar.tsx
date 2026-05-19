import {
  Home,
  Search,
  Plus,
  MessageCircle,
  Heart,
  User,
  BarChart3,
  Bookmark,
  Menu,
} from "lucide-react";

export default function LoggedInSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-[260px] px-5 py-6 border-r border-[#1f1f1f]">
      {/* Logo */}
      <h1 className="text-[42px] font-bold tracking-tight mb-10">
        @threads
      </h1>

      {/* Menu */}
      <nav className="space-y-1">
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl bg-[#1f1f1f] text-white font-medium">
          <Home size={22} />
          For you
        </button>

        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-[#111] transition-colors">
          <Plus size={22} />
          New thread
        </button>

        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-[#111] transition-colors">
          <Search size={22} />
          Search
        </button>

        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-[#111] transition-colors">
          <MessageCircle size={22} />
          Messages
        </button>

        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-[#111] transition-colors">
          <Heart size={22} />
          Activity
        </button>

        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-[#111] transition-colors">
          <User size={22} />
          Profile
        </button>

        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-[#111] transition-colors">
          <BarChart3 size={22} />
          Insights
        </button>

        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-[#111] transition-colors">
          <Bookmark size={22} />
          Saved
        </button>
      </nav>

      {/* Bottom */}
      <div className="mt-auto">
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-[#111] transition-colors">
          <Menu size={22} />
          More
        </button>
      </div>
    </aside>
  );
}