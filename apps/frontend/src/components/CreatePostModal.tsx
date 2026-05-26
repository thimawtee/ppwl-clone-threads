import { useState, useEffect } from "react";
import { ImagePlus, X } from "lucide-react";
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

  // image ratio state
  const [imageRatio, setImageRatio] = useState("1 / 1");

  // discard popup state
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!previewUrl) return;

    const img = new Image();

    img.onload = () => {
      setImageRatio(`${img.width} / ${img.height}`);
    };

    img.src = previewUrl;
  }, [previewUrl]);

  if (!open) return null;

  const hasContent = content.trim() || selectedFile;

  function resetForm() {
    setContent("");
    setSelectedFile(null);
    setPreviewUrl("");
    setImageRatio("1 / 1");
  }

  function handleCancel() {
    // kondisi 1
    if (!hasContent) {
      onClose();
      return;
    }

    // kondisi 2
    setShowDiscardModal(true);
  }

  function handleDiscardPost() {
    resetForm();
    setShowDiscardModal(false);
    onClose();
  }

  async function handleSubmit() {
    if (!content.trim() && !selectedFile) return;

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

      resetForm();

      onClose();

      window.location.reload();
    } catch {
      alert("Terjadi kesalahan saat membuat thread.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-black/70  flex items-center justify-center px-4 py-10">
        <div
          className="
            relative
            w-full
            max-w-[620px]
            h-[88vh]
            bg-[#0f0f0f]
            border
            border-[#262626]
            rounded-[28px]
            shadow-2xl
            flex
            flex-col
            overflow-hidden
          "
        >
          {/* HEADER */}
          <div
            className="
              sticky
              top-0
              z-20
              flex
              items-center
              justify-between
              px-5
              py-4
              border-b
              border-[#262626]
              bg-[#0f0f0f]
              shrink-0
            "
          >
            <button
              type="button"
              onClick={handleCancel}
              className="
                text-[15px]
                text-white
                hover:opacity-80
                transition-opacity
              "
            >
              Cancel
            </button>

            <h2 className="font-bold text-[18px]">New thread</h2>

            <div className="w-[52px]" />
          </div>

          {/* SCROLLABLE CONTENT */}
          <div
            className="
              flex-1
              overflow-y-auto
              p-4
              sm:p-5
            "
          >
            <div className="flex gap-3">
              {/* Avatar */}
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

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Username */}
                <p className="font-semibold text-[15px] leading-none mb-1">
                  {user?.username || user?.name}
                </p>

                {/* Textarea */}
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's new?"
                  className="
                    w-full
                    bg-transparent
                    text-white
                    placeholder:text-[#777]
                    outline-none
                    resize-none
                    text-[15px]
                    min-h-[34px]
                    leading-5
                    pt-0.5
                  "
                />

                {/* Upload */}
                <div className="flex items-center gap-4 -mt-5">
                  <label className="flex items-center gap-2 text-[#777] hover:text-white cursor-pointer transition-colors">
                    <ImagePlus size={20} />

                    <span className="text-sm">
                      {selectedFile
                        ? selectedFile.name
                        : "Upload image"}
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
                </div>

                {/* Preview */}
                {previewUrl && (
                  <div
                    className="
                      relative
                      mt-4
                      w-full
                      rounded-2xl
                      overflow-hidden
                      border
                      border-[#2a2a2a]
                      bg-black
                    "
                    style={{
                      aspectRatio: imageRatio,
                    }}
                  >
                    {/* Remove Image Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl("");
                        setImageRatio("1 / 1");
                      }}
                      className="
                        absolute
                        top-3
                        right-3
                        z-10
                        w-9
                        h-9
                        rounded-full
                        bg-black/60
                        backdrop-blur-sm
                        flex
                        items-center
                        justify-center
                        hover:bg-black/80
                        transition-colors
                      "
                    >
                      <X size={16} className="text-white" />
                    </button>

                    {/* Image */}
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="
                        w-full
                        h-full
                        object-contain
                      "
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div
            className="
              shrink-0
              flex
              justify-end
              px-5
              py-4
              border-t
              border-[#262626]
              bg-[#0f0f0f]
            "
          >
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || (!content.trim() && !selectedFile)}
              className="
                px-6
                py-2
                rounded-xl
                border
                border-white/20
                bg-[#0f0f0f]
                text-white
                font-semibold
                transition-all
                duration-200
                disabled:opacity-40
                disabled:cursor-not-allowed
                hover:bg-[#1d1d1d]
                hover:border-white/40
              "
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>

      {/* DISCARD MODAL */}
      {showDiscardModal && (
        <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
          <div
            className="
              w-full
              max-w-[280px]
              bg-[#181818]
              border
              border-[#2a2a2a]
              rounded-3xl
              overflow-hidden
              shadow-2xl
            "
          >
            {/* Content */}
            <div className="px-6 py-7 text-center">
              <h3 className="text-white text-[20px] font-bold">
                Discard post?
              </h3>

              <p className="mt-3 text-[#8e8e93] text-[15px] leading-6">
                If you leave, your post will not be saved.
              </p>
            </div>

            {/* Actions */}
            <div className="border-t border-[#2a2a2a]">
              <button
                type="button"
                onClick={handleDiscardPost}
                className="
                  w-full
                  py-4
                  text-red-500
                  font-semibold
                  text-[16px]
                  hover:bg-white/5
                  transition-colors
                "
              >
                Discard
              </button>

              <div className="border-t border-[#2a2a2a]" />

              <button
                type="button"
                onClick={() => setShowDiscardModal(false)}
                className="
                  w-full
                  py-4
                  text-white
                  text-[16px]
                  hover:bg-white/5
                  transition-colors
                "
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}