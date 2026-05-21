import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/services/api";

export function usePosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/posts`)
      .then((res) => setPosts(res.data.data));
  }, []);

  return { posts };
}