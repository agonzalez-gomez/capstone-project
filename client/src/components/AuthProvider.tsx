import { useEffect, useState, type ReactNode } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    checkLoggedIn();
  }, []);

  const checkLoggedIn = async () => {
    console.log("Checking signed in");
    try {
      const isVerified = await API.verifyAuth();
      console.log("User is signed in: ", isVerified);
      if (isVerified) {
        setSignedIn(true);
      } else {
        setSignedIn(false);
      }
    } catch (e) {
      console.error(e);
      setSignedIn(false);
    }
  };

  const logout = () => {
    API.logout();
    setSignedIn(false);
  };

  return (
    <AuthContext.Provider value={{ signedIn, checkLoggedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
