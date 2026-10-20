import { ObjectId } from "mongodb";

declare global {
  type UserPayload = {
    username: string;
    password: string;
  };

  type SessionUpdatePayload = {
    page?: number;
    resolved?: boolean;
    rating?: number;
    comments?: string;
  };

  type JWTPayload = {
    userId: string;
    username: string;
  };
}
