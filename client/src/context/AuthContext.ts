import { createContext } from "react";

export type AuthContextValue = {
  signedIn: boolean;
  checkLoggedIn: () => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue>({
  signedIn: false,
  checkLoggedIn: async () => {},
  logout: () => {},
});
