import type { UserDTO } from "./user";

export type NotificationType = "LIKE" | "COMMENT";

export interface NotificationDTO {
  id: string;
  type: NotificationType;
  userId: string;
  actorId: string;
  postId: string | null;
  commentId: string | null;
  isRead: boolean;
  createdAt: string;
  actor?: Pick<UserDTO, "id" | "name" | "username" | "avatarUrl">;
}