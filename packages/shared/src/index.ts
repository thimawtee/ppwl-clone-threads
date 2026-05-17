export type UserRole = "USER" | "ADMIN";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};