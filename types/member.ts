import type { User } from "./user";

export interface Member {
  id: string;
  name?: string;

  user: User | null;
}