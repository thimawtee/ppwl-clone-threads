export default function FeedComposer() {
  return (
    <div className="border-b border-[#262626] px-6 py-4">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-400 to-green-300 flex-shrink-0" />

        {/* Input */}
        <input
          type="text"
          placeholder="What's new?"
          className="flex-1 bg-transparent outline-none text-[15px] text-white placeholder-[#666]"
        />

        {/* Button */}
        <button className="h-9 px-5 rounded-xl border border-[#2a2a2a] hover:bg-[#151515] text-sm font-semibold transition-colors">
          Post
        </button>
      </div>
    </div>
  );
}