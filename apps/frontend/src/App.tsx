import { useState, useEffect } from "react";
import BerandaPage from "./pages/BerandaPage";
import ThreadDetailPage from "./components/threaddetail"; // Pastikan path ini sesuai tempat kamu menaruh file tadi

// ─── Types ───────────────────────────────────────────────────────────────────
interface User {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
}

interface Post {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  user: User;
  likeCount: number;
  commentCount: number;
}

export default function App() {
  // State untuk menyimpan thread/postingan mana yang sedang dibuka komentarnya
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  
  // State status login (disinkronkan dengan session storage bawaan BerandaPage)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("threads_token");
    setIsLoggedIn(!!token);
  }, [selectedPost]); // Re-cek status login saat berpindah halaman

  // Fungsi pembantu untuk memicu modal login muncul di halaman beranda
  function triggerLoginPrompt() {
    setSelectedPost(null); // Kembalikan ke beranda
    // Di halaman beranda, modal login akan otomatis terbuka jika dipicu aksi auth
  }

  return (
    <div className="bg-[#101010] min-h-screen text-white selection:bg-zinc-800">
      {selectedPost ? (
        /* Halaman Detail Komentar 💬 */
        <ThreadDetailPage
          post={selectedPost}
          onBack={() => setSelectedPost(null)} // Tombol kembali akan mereset state dan membawamu ke beranda
          isLoggedIn={isLoggedIn}
          onLoginRequired={triggerLoginPrompt}
        />
      ) : (
        /* Halaman Utama / Beranda Feed 🧵 */
        <BerandaPage 
          onSelectThread={(post) => setSelectedPost(post)} 
        />
      )}
    </div>
  );
}