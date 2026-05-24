import { useState } from "react";
import { toast } from "sonner";
import { API_URL } from "../../services/api";
import { useAuthStore } from "../../stores/auth.store";

export default function FeedComposer() {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const token = useAuthStore((state) => state.token);

  async function handleCreatePost() {

    if (!token) {
      toast.error("Silakan login terlebih dahulu.");
      return;
    }

    if (!content.trim()) {
      toast.error("Postingan tidak boleh kosong.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: content.trim(),
          imageUrl: imageUrl.trim() || null,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Gagal membuat postingan.");
      }

      toast.success("Postingan berhasil dibuat.");

      setContent("");
      setImageUrl("");

      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-b border-[#262626] px-6 py-4">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-400 to-green-300 flex-shrink-0" />

        {/* Form */}
        <div className="flex-1">
          {/* Content */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's new?"
            className="w-full bg-transparent outline-none text-[15px] text-white placeholder-[#666] resize-none min-h-[60px]"
          />

          {/* Image URL */}
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Image URL (optional)"
            className="w-full mt-3 bg-[#151515] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm outline-none text-white placeholder-[#666]"
          />

          {/* Preview */}
          {imageUrl && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-[#2a2a2a]">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full max-h-[400px] object-cover"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleCreatePost}
              disabled={loading}
              className="h-10 px-6 rounded-xl border border-[#2a2a2a] hover:bg-[#151515] text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}