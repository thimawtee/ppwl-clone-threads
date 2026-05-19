import { useState, useEffect, useRef } from "react";
import logoInstagram from "../assets/images/logo-Instagram.png";
import CreatePostModal from "../components/CreatePostModal";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../services/api";

import {
  Heart,
  MessageCircle,
  Repeat2,
  Send,
  MoreHorizontal,
  Image,
  X,
  Loader2,
} from "lucide-react";

import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import CreatePostModal from "../components/CreatePostModal";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../services/api";
import { Loader2 } from "lucide-react";
import { DesktopSidebar, MobileBottomNav } from "../components/Sidebar";

interface PostUser {
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
  user: PostUser;
  likeCount: number;
  commentCount: number;
}

export default function BerandaPage() {
  const BACKEND_URL = API_URL;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("home");
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<PostUser | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(`${BACKEND_URL}/posts`);
        const data = await res.json();
        if (data.success) {
          setPosts(data.data);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [BACKEND_URL]);

  return (
    <div className="min-h-screen bg-[#101010] text-white">
      <div className="flex min-h-screen max-w-[1280px] mx-auto">
        {/* Sidebar */}
        <DesktopSidebar
          currentUser={currentUser}
          activePage={activePage}
          onNav={(page) => {
            if (page === "create" && !currentUser) {
              setShowCreateModal(true);
              return;
            }
            setActivePage(page);
          }}
        />

        {/* Main */}
        <main className="flex-1 min-w-0 lg:max-w-[680px] border-x border-[#1e1e1e]">
          <div className="hidden lg:flex items-center justify-center h-[60px] border-b border-[#1f1f1f] sticky top-0 bg-[#101010]/90 backdrop-blur-md z-30">
            <h1 className="text-[17px] font-semibold">Home</h1>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={28} className="animate-spin text-[#555]" />
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isLoggedIn={!!currentUser}
                onLoginRequired={() => navigate("/home")}
                onCommentClick={() => navigate(`/posts/${post.id}`)}
              />
            ))
          )}
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden xl:flex flex-col w-[360px] flex-shrink-0 py-6 px-6 sticky top-0 h-screen overflow-y-auto">
 
        </aside>
      </div>

      {/* Mobile Nav */}
      <MobileBottomNav
        currentUser={currentUser}
        activePage={activePage}
        onNav={(page) => {
          if (page === "create" && !currentUser) {
            setShowCreateModal(true);
            return;
          }
          setActivePage(page);
        }}
      />

      <CreatePostModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}