import { useEffect, useState } from "react";

import LoggedInSidebar from "../components/loggedin/LoggedInSidebar";
import FeedComposer from "../components/loggedin/FeedComposer";
import FeedPost from "../components/loggedin/FeedPost";

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
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

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
          <div className="mx-6 border border-[#262626] rounded-[28px] overflow-hidden">
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
      <button className="fixed bottom-6 right-6 w-16 h-16 rounded-3xl border border-[#2a2a2a] bg-[#111] hover:bg-[#1a1a1a] transition-colors flex items-center justify-center shadow-2xl">
        <span className="text-4xl font-light leading-none -mt-1">
          +
        </span>
      </button>
    </div>

    
  );
}