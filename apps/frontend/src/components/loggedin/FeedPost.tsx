import {
  Heart,
  MessageCircle,
  Repeat2,
  Send,
  MoreHorizontal,
} from "lucide-react";

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

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 3600) return `${Math.floor(diff / 60)}m`;

  return `${Math.floor(diff / 3600)}h`;
}

export default function FeedPost({
  post,
}: {
  post: Post;
}) {
  return (
    <article className="border-b border-[#262626] px-6 py-5">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#222]">
            {post.user.avatarUrl && (
              <img
                src={post.user.avatarUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">
                {post.user.username}
              </span>

              <span className="text-[#777] text-sm">
                {timeAgo(post.createdAt)}
              </span>
            </div>

            <button className="text-[#777] hover:text-white">
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* Text */}
          <p className="text-[15px] text-[#f5f5f5] leading-6 mt-1 whitespace-pre-wrap">
            {post.content}
          </p>

          {/* Image */}
          {post.imageUrl && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-[#2a2a2a]">
              <img
                src={post.imageUrl}
                alt=""
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-6 mt-4 text-[#999]">
            <button className="flex items-center gap-1 hover:text-white">
              <Heart size={20} />
              <span className="text-sm">{post.likeCount}</span>
            </button>

            <button className="flex items-center gap-1 hover:text-white">
              <MessageCircle size={20} />
              <span className="text-sm">{post.commentCount}</span>
            </button>

            <button className="hover:text-white">
              <Repeat2 size={20} />
            </button>

            <button className="hover:text-white">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}