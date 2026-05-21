export type Provider = "EMAIL" | "GOOGLE";

export interface UserDTO {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  bio?: string | null;
  provider?: Provider;
}