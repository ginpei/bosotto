import { useEffect, useState } from "react";
import { auth } from "../misc/firebase";

export function useCurrentUserId(): [string] {
  const [userId, setUserId] = useState(auth.currentUser?.uid ?? "");

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setUserId(user?.uid ?? "");
    });
  }, []);

  return [userId];
}
