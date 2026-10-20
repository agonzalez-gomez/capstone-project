import { createContext } from "react";

export type AuthContextValue = {
  signedIn: boolean;
  checking: boolean;
  checkLoggedIn: () => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue>({
  signedIn: false,
  checking: true,
  checkLoggedIn: async () => {},
  logout: () => {},
});
