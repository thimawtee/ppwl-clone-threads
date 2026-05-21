import { useEffect, useState } from "react";
import { API_URL } from "../services/api";
import LoggedInSidebar from "../components/loggedin/LoggedInSidebar";
import FeedComposer from "../components/loggedin/FeedComposer";
import FeedPost from "../components/loggedin/FeedPost";
import { useAuthStore } from "@/stores/auth.store";

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

export default function HomeLoggedInPage() {
  const BACKEND_URL = API_URL;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {

  if (!token || !user) {
    window.location.href = "/login";
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
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <LoggedInSidebar />

      {/* Feed */}
      <main className="flex-1 flex justify-center">
        <div className="w-full max-w-[640px]">
          {/* Header */}
          <div className="pt-4 pb-6 px-6">
            <h1 className="text-[32px] font-bold tracking-tight">
              For you
            </h1>
          </div>

          {/* Composer */}
        <div className="mx-2 md:mx-6 border border-[#262626] rounded-[20px] md:rounded-[28px] overflow-hidden mb-24">
            <FeedComposer />

            {/* Posts */}
            {loading ? (
              <div className="py-20 text-center text-[#777]">
                Loading...
              </div>
            ) : (
              posts.map((post) => (
                <FeedPost
                  key={post.id}
                  post={post}
                />
              ))
            )}
          </div>
        </div>
      </main>
            {/* Floating Create Button */}
      <button className="hidden md:flex fixed bottom-6 right-6 w-16 h-16 rounded-3xl border border-[#2a2a2a] bg-[#111] hover:bg-[#1a1a1a] transition-colors items-center justify-center shadow-2xl">
        <span className="text-4xl font-light leading-none -mt-1">
          +
        </span>
      </button>
    </div>

    
  );
}