import firebase from "firebase/app";
import { useEffect, useState } from "react";
import { auth } from "../misc/firebase";

export function useCurrentUser(): [firebase.User | null] {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    return auth.onAuthStateChanged((newUser) => {
      setUser(newUser);
    });
  }, []);

  return [user];
}

export function useCurrentUserId(): string {
  return useCurrentUser()[0]?.uid ?? "";
}
