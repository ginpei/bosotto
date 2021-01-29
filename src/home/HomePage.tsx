import { useEffect } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { noop } from "../misc/misc";
import { appSlice, AppState, appStore } from "../models/appReducer";
import { useCurrentUserId } from "../models/CurrentUser";
import { defaultShortcuts } from "../models/defaultShortcuts";
import { useCurrentFocusAttr } from "../models/Focus";
import { useKeyboardShortcuts } from "../models/KeyboardOperation";
import { getUserTaskCollection, ssToTask, Task } from "../models/Task";
import { AppHeader } from "../shared/layouts/AppHeader";
import { Dashboard } from "./Dashboard";
import "./HomePage.scss";
import { Timeline } from "./Timeline";

const mapState = (state: AppState) => ({
  focus: state.focus,
});

const mapDispatch = (dispatch: Dispatch) => ({
  setUserTasks: (userTasks: Task[]) =>
    dispatch(appSlice.actions.setUserTasks({ userTasks })),
});

const HomePageInner: React.FC<
  ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>
> = ({ focus, setUserTasks }) => {
  useKeyboardShortcuts(appStore, defaultShortcuts);
  useCurrentFocusAttr(focus);
  const userId = useCurrentUserId();

  useEffect(() => {
    if (!userId) {
      return noop;
    }

    const query = getUserTaskCollection(userId);
    return query.onSnapshot((ss) => {
      const userTasks = ss.docs.map((v) => ssToTask(v));
      console.log("# userTasks", userTasks);
      setUserTasks(userTasks);
    });
  }, [userId, setUserTasks]);

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

export const HomePage = connect(mapState, mapDispatch)(HomePageInner);
