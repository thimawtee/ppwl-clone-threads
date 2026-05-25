import { useAuthStore } from "@/stores/auth.store";

export default function ComposerBox({
  onCreateThread,
}: {
  onCreateThread: () => void;
}) {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="px-6 py-4 border-b border-[#1f1f1f]">
      <div
        onClick={onCreateThread}
        className="border border-[#2a2a2a] rounded-[28px] px-5 py-4 flex items-center gap-4 cursor-pointer"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 to-green-300 flex items-center justify-center shrink-0">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <input
          type="text"
          placeholder="What's new?"
          readOnly
          className="flex-1 bg-transparent outline-none text-[15px] placeholder-[#666] cursor-pointer"
        />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCreateThread();
          }}
          className="h-9 px-5 rounded-xl bg-[#151515] hover:bg-[#222] text-sm font-semibold"
        >
          Post
        </button>
      </div>
    </div>
  );
}