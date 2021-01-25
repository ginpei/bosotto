import { connect } from "react-redux";
import { AppState, appStore } from "../models/appReducer";
import { defaultShortcuts } from "../models/defaultShortcuts";
import { useCurrentFocusAttr } from "../models/Focus";
import { useKeyboardShortcuts } from "../models/KeyboardOperation";
import { AppHeader } from "../shared/layouts/AppHeader";
import { Dashboard } from "./Dashboard";
import "./HomePage.scss";
import { Timeline } from "./Timeline";

const mapState = (state: AppState) => ({
  focus: state.focus,
});

const HomePageInner: React.FC<ReturnType<typeof mapState>> = ({ focus }) => {
  useKeyboardShortcuts(appStore, defaultShortcuts);
  useCurrentFocusAttr(focus);

  return (
    <div className="HomePage">
      <AppHeader />
      <div className="HomePage-frame ui-container">
        <div className="HomePage-timeline">
          <Timeline />
        </div>
        <div className="HomePage-dashboard">
          <Dashboard />
        </div>
      </div>
    </div>
  );
};

export const HomePage = connect(mapState)(HomePageInner);
