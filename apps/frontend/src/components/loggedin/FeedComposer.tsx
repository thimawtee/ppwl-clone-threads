import { useAuthStore } from "@/stores/auth.store";

function getAvatarColor(userId: string) {
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

  return colors[userId.charCodeAt(0) % colors.length];
}

interface FeedComposerProps {
  onCreateThread: () => void;
}

export default function FeedComposer({
  onCreateThread,
}: FeedComposerProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <div
      onClick={onCreateThread}
      className="
        border-b
        border-[#262626]
        px-6
        py-4
        cursor-pointer
      "
    >
      <div className="flex items-center gap-4">
        {/* AVATAR */}
        <div
          className={`
            w-11
            h-11
            rounded-full
            overflow-hidden
            flex
            items-center
            justify-center
            text-white
            font-bold
            shrink-0
            ${getAvatarColor(user?.id || "default")}
          `}
        >
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            user?.name?.charAt(0).toUpperCase() || "U"
          )}
        </div>

        {/* INPUT */}
        <div className="flex-1 text-[#777] text-[15px]">
          What's new?
        </div>

        {/* BUTTON */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCreateThread();
          }}
          className="
            px-6
            py-2
            rounded-xl
            border
            border-[#2a2a2a]
            text-sm
            font-semibold
            hover:bg-[#151515]
          "
        >
          Post
        </button>
      </div>
    </div>
  );
}