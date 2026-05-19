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
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();

  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;

  return `${Math.floor(diff / 86400)}d`;
}

export default function FeedPostCard({
  post,
}: {
  post: Post;
}) {
  return (
    <article className="px-6 py-4 border-b border-[#1f1f1f]">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-10 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#222]">
            {post.user.avatarUrl && (
              <img
                src={post.user.avatarUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="w-px flex-1 bg-[#222] mt-2" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[15px]">
                {post.user.username}
              </span>

              <span className="text-[#777] text-sm">
                {timeAgo(post.createdAt)}
              </span>
            </div>

            <button className="text-[#777] hover:text-white">
              <MoreHorizontal size={17} />
            </button>
          </div>

          <p className="text-[15px] leading-6 text-[#f3f3f3] mt-1 whitespace-pre-wrap">
            {post.content}
          </p>

          {post.imageUrl && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-[#2a2a2a]">
              <img
                src={post.imageUrl}
                alt=""
                className="w-full max-h-[500px] object-cover"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-5 mt-3 text-[#999]">
            <button className="hover:text-white">
              <Heart size={19} />
            </button>

            <button className="hover:text-white">
              <MessageCircle size={19} />
            </button>

            <button className="hover:text-white">
              <Repeat2 size={19} />
            </button>

            <button className="hover:text-white">
              <Send size={19} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}