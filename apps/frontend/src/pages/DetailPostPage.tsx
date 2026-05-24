import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ThreadDetail from "@/components/ThreadDetail";
import { API_URL } from "../services/api";
import { useAuthStore } from "../stores/auth.store";

export default function DetailPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  const isLoggedIn = !!token && !!user;

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        const res = await fetch(`${API_URL}/posts/${id}`);
        const result = await res.json();

        if (result.success) {
          setPost(result.data);
        }
      } finally {
        setLoading(false);
      }
    }

    if (id) loadPost();
  }, [id]);

  if (loading) return <div className="text-white p-6">Loading...</div>;

  if (!post) {
    return <div className="text-white p-6">Post tidak ditemukan.</div>;
  }

  return (
    <ThreadDetail
      post={post}
      onBack={() => navigate(-1)}
      isLoggedIn={isLoggedIn}
      onLoginRequired={() => navigate("/login")}
    />
  );
}