import { useKeyboardShortcuts } from "../models/KeyboardOperation";
import { AppHeader } from "../shared/layouts/AppHeader";
import { Dashboard } from "./Dashboard";
import "./HomePage.scss";
import { Timeline } from "./Timeline";

export const HomePage: React.FC = () => {
  useKeyboardShortcuts(true);

  return (
    <div className="HomePage">
      <AppHeader />
      <div className="HomePage-frame ui-container">
        <div className="HomePage-timeline" data-focus-name="timeline">
          <Timeline />
        </div>
        <div className="HomePage-dashboard" data-focus-name="dashboard">
          <Dashboard />
        </div>
      </div>
    </div>
  );
};
