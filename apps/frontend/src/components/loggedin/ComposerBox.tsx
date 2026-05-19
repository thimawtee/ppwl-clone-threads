export default function ComposerBox() {
  return (
    <div className="px-6 py-4 border-b border-[#1f1f1f]">
      <div className="border border-[#2a2a2a] rounded-[28px] px-5 py-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-green-300" />

        <input
          type="text"
          placeholder="What's new?"
          className="flex-1 bg-transparent outline-none text-[15px] placeholder-[#666]"
        />

        <button className="h-9 px-5 rounded-xl bg-[#151515] hover:bg-[#222] text-sm font-semibold">
          Post
        </button>
      </div>
    </div>
  );
}