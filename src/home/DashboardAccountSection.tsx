import { auth } from "../misc/firebase";
import { useCurrentUserId } from "../models/CurrentUser";
import { DashboardSection } from "./Dashboard";
import { LogInForm } from "./LogInForm";

export const DashboardAccountSection: React.FC = () => {
  const [userId] = useCurrentUserId();

  const onLogOutClick = async () => {
    await auth.signOut();
  };

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
