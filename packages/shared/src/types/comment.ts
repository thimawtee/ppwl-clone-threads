import type { UserDTO } from "./user";

export interface CommentDTO {
  id: string;
  content: string;
  postId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: Pick<UserDTO, "id" | "name" | "username" | "avatarUrl">;
}