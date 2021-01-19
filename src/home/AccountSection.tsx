import { auth } from "../misc/firebase";
import { useCurrentUser } from "../models/CurrentUser";
import { DashboardSection } from "./Dashboard";
import { LogInForm } from "./LogInForm";

export const AccountSection: React.FC = () => {
  const [user] = useCurrentUser();

  return (
    <DashboardSection className="AccountSection" title="Account">
      {user ? <LogOutForm /> : <LogInForm />}
    </DashboardSection>
  );
};

const LogOutForm: React.FC = () => {
  const [user] = useCurrentUser();

  const onLogOutClick = async () => {
    await auth.signOut();
  };

  return (
    <div className="LogOutForm">
      <p>Name: {user?.displayName || "(No name)"}</p>
      <button onClick={onLogOutClick}>Log out</button>
    </div>
  );
};
