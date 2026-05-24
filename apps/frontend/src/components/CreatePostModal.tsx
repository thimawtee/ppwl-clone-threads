import logoInstagram from "../assets/images/logo-Instagram.png";
import { X, PenSquare, ChevronRight } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreatePostModal({
  open,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="relative w-full max-w-[520px] bg-[#0f0f0f] border border-[#262626] rounded-[32px] px-8 py-10 shadow-2xl">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#777] hover:text-white transition-colors"
        >
          <X size={22} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 via-orange-400 to-purple-500 flex items-center justify-center">
            <PenSquare size={28} className="text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-[42px] font-extrabold leading-none text-white mb-5">
          Sign up to post
        </h2>

        {/* Subtitle */}
        <p className="text-center text-[#8e8e93] text-[18px] leading-8 max-w-[420px] mx-auto mb-10">
          Join Threads to share ideas, ask questions,
          post random thoughts and more.
        </p>

        {/* Instagram Button */}
        <button className="w-full bg-black border border-[#2c2c2e] hover:bg-[#151515] transition-all rounded-[28px] px-5 py-5 flex items-center justify-between group">
          <div className="flex items-center gap-4">
            <img
              src={logoInstagram}
              alt="Instagram"
              className="w-14 h-14 rounded-2xl object-cover"
            />

            <div className="text-left">
              <p className="text-[#b0b0b0] text-[16px]">
                Continue with Instagram
              </p>

              <p className="text-white font-bold text-[20px]">
                thimawtee
              </p>
            </div>
          </div>

          <ChevronRight
            size={24}
            className="text-[#777] group-hover:text-white transition-colors"
          />
        </button>
      </div>
    </div>
  );
}