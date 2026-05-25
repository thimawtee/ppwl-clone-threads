import { useState } from "react";
import { X, ImagePlus } from "lucide-react";
import { API_URL } from "@/services/api";
import { useAuthStore } from "@/stores/auth.store";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreatePostModal({ open, onClose }: Props) {
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  if (!open) return null;

  async function handleSubmit() {
    if (!content.trim()) return;

    try {
      setLoading(true);

      let uploadedImageUrl: string | null = null;

      if (selectedFile) {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      const cleanBase64 = result.split(",")[1];
      resolve(cleanBase64);
    };

    reader.onerror = reject;
    reader.readAsDataURL(selectedFile);
  });

  const uploadRes = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName: selectedFile.name,
      fileType: selectedFile.type,
      base64,
    }),
  });

  const uploadData = await uploadRes.json();

  if (!uploadData.success) {
    alert(uploadData.message || "Gagal upload gambar.");
    return;
  }

  uploadedImageUrl = uploadData.data.url;
}

      const res = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: content.trim(),
          imageUrl: uploadedImageUrl,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Gagal membuat thread.");
        return;
      }

      setContent("");
      setSelectedFile(null);
      setPreviewUrl("");
      onClose();
      window.location.reload();
    } catch {
      alert("Terjadi kesalahan saat membuat thread.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 overflow-y-auto py-10">
      <div className="relative w-full max-w-[560px] max-h-[90vh] overflow-y-auto bg-[#0f0f0f] border border-[#262626] rounded-[28px] shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#262626]">
          <button
            type="button"
            onClick={onClose}
            className="text-[#777] hover:text-white transition-colors"
          >
            <X size={22} />
          </button>

          <h2 className="font-bold text-lg">New thread</h2>

          <div className="w-[22px]" />
        </div>

        <div className="p-5">
          <div className="flex gap-4">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-green-400 overflow-hidden shrink-0 flex items-center justify-center">
  {user?.avatarUrl ? (
    <img
      src={user.avatarUrl}
      alt={user.name}
      className="w-full h-full object-cover"
    />
  ) : (
    <span className="text-white font-bold text-lg">
      {user?.name?.charAt(0).toUpperCase()}
    </span>
  )}
</div>

            <div className="flex-1">
              <p className="font-semibold mb-2">
                {user?.username || user?.name}
              </p>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's new?"
                className="w-full min-h-[120px] bg-transparent text-white placeholder:text-[#777] outline-none resize-none"
              />

              <label className="mt-4 flex items-center gap-2 text-[#777] hover:text-white cursor-pointer">
                <ImagePlus size={20} />
                <span className="text-sm">
                  {selectedFile ? selectedFile.name : "Upload image"}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (!file) return;

                    setSelectedFile(file);
                    setPreviewUrl(URL.createObjectURL(file));
                  }}
                />
              </label>

              {previewUrl && (
                <div className="mt-4 rounded-2xl overflow-hidden border border-[#2a2a2a]">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full max-h-[420px] object-contain bg-black"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              className="px-6 py-2 rounded-full bg-white text-black font-semibold disabled:opacity-40"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}