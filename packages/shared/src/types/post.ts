import type { UserDTO } from "./user";
import type { CommentDTO } from "./comment";

export interface PostDTO {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt?: string;
  user: Pick<UserDTO, "id" | "name" | "username" | "avatarUrl">;
  likeCount: number;
  commentCount: number;
}

export interface PostDetailDTO extends PostDTO {
  comments: CommentDTO[];
}