import { useAuthStore } from "@/stores/auth.store";

interface FeedComposerProps {
  onCreateThread: () => void;
}

export default function FeedComposer({ onCreateThread }: FeedComposerProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <div
      onClick={onCreateThread}
      className="border-b border-[#262626] px-6 py-4 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 to-green-300 flex items-center justify-center text-white font-bold shrink-0">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            user?.name?.charAt(0).toUpperCase()
          )}
        </div>

        <div className="flex-1 text-[#777] text-[15px]">
          What's new?
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCreateThread();
          }}
          className="px-6 py-2 rounded-xl border border-[#2a2a2a] text-sm font-semibold hover:bg-[#151515]"
        >
          Post
        </button>
      </div>
    </div>
  );
}