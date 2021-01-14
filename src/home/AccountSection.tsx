import { auth } from "../misc/firebase";
import { useCurrentUserId } from "../models/CurrentUser";
import { DashboardSection } from "./Dashboard";
import { LogInForm } from "./LogInForm";

export const AccountSection: React.FC = () => {
  const [userId] = useCurrentUserId();

  return (
    <DashboardSection className="AccountSection" title="Account">
      {userId ? <LogOutForm /> : <LogInForm />}
    </DashboardSection>
  );
};

const LogOutForm: React.FC = () => {
  const onLogOutClick = async () => {
    await auth.signOut();
  };

  return (
    <div className="LogOutForm">
      <button onClick={onLogOutClick}>Log out</button>
    </div>
  );
};
