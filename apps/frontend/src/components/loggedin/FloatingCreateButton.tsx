import { Plus } from "lucide-react";

interface FloatingCreateButtonProps {
  onClick: () => void;
}

export default function FloatingCreateButton({
  onClick,
}: FloatingCreateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-6 right-6 w-16 h-16 rounded-3xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-white shadow-lg hover:bg-[#222] transition-colors z-50"
    >
      <Plus size={32} strokeWidth={2} />
    </button>
  );
}