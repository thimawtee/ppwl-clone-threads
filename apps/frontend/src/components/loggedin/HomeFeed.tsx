import FeedPostCard from "./FeedPostCard";
import ComposerBox from "./ComposerBox";
import FloatingCreateButton from "./FloatingCreateButton";

interface Post {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  user: any;
}

export default function HomeFeed({
  posts,
  onCreateThread,
}: {
  posts: Post[];
  onCreateThread: () => void;
}) {
  return (
    <main className="flex-1 max-w-[640px] border-r border-[#1f1f1f] relative">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-[#1f1f1f]">
        <div className="h-[60px] flex items-center justify-center">
          <h1 className="font-semibold text-xl">
            For you
          </h1>
        </div>

        <ComposerBox onCreateThread={onCreateThread} />
      </div>

      {/* Posts */}
      {posts.map((post) => (
        <FeedPostCard
          key={post.id}
          post={post}
        />
      ))}

      {/* Floating Button */}
      <FloatingCreateButton onClick={onCreateThread} />
    </main>
  );
}