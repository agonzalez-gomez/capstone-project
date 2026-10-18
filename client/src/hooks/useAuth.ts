import { useEffect, useState } from "react";
import API from "../services/api";

export default function useAuth() {
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

  return {
    signedIn,
    checkLoggedIn,
  };
}
