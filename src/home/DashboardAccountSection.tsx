import { useEffect, useState } from "react";
import { auth } from "../misc/firebase";
import { DashboardSection } from "./Dashboard";
import { LogInForm } from "./LogInForm";

export const DashboardAccountSection: React.FC = () => {
  const [userId, setUserId] = useState(auth.currentUser?.uid);

  const onLogOutClick = async () => {
    await auth.signOut();
  };

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setUserId(user?.uid);
    });
  }, []);

  return (
    <DashboardSection className="DashboardAccountSection" title="Account">
      {userId ? (
        <p>
          <button onClick={onLogOutClick}>Log out</button>
        </p>
      ) : (
        <LogInForm />
      )}
    </DashboardSection>
  );
};
