import { useEffect } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { noop } from "../misc/misc";
import { appSlice, AppState, appStore } from "../models/appReducer";
import { useCurrentUserId } from "../models/CurrentUser";
import { defaultShortcuts } from "../models/defaultShortcuts";
import { useCurrentFocusAttr } from "../models/Focus";
import { useKeyboardShortcuts } from "../models/KeyboardOperation";
import { getUserTalkCollection, ssToTalk, Talk } from "../models/Talk";
import { getUserTaskCollection, ssToTask, Task } from "../models/Task";
import { AppHeader } from "../shared/layouts/AppHeader";
import { Dashboard } from "./Dashboard";
import "./HomePage.scss";
import { Timeline } from "./Timeline";

const mapState = (state: AppState) => ({
  focus: state.focus,
  showingArchivedTasks: state.showingArchivedTasks,
});

const mapDispatch = (dispatch: Dispatch) => ({
  setTalks: (talks: Talk[]) => dispatch(appSlice.actions.setTalks({ talks })),
  setUserTasks: (userTasks: Task[]) =>
    dispatch(appSlice.actions.setUserTasks({ userTasks })),
});

const HomePageInner: React.FC<
  ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>
> = ({ focus, setTalks, setUserTasks, showingArchivedTasks }) => {
  useKeyboardShortcuts(appStore, defaultShortcuts);
  useCurrentFocusAttr(focus);
  const userId = useCurrentUserId();
  useUserTalksConnection(userId, setTalks);
  useUserTaskConnection(userId, showingArchivedTasks, setUserTasks);

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

function useUserTalksConnection(
  userId: string,
  setTalks: (talks: Talk[]) => { payload: { talks: Talk[] }; type: string }
) {
  useEffect(() => {
    if (!userId) {
      return noop;
    }

    const query = getUserTalkCollection(userId).orderBy("createdAt", "desc");

    return query.onSnapshot((ss) => {
      const userTasks = ss.docs.map((v) => ssToTalk(v));
      setTalks(userTasks);
    });
  }, [setTalks, userId]);
}

function useUserTaskConnection(
  userId: string,
  showingArchivedTasks: boolean,
  setUserTasks: (
    userTasks: Task[]
  ) => { payload: { userTasks: Task[] }; type: string }
) {
  useEffect(() => {
    if (!userId) {
      return noop;
    }

    const baseQuery = getUserTaskCollection(userId);
    const filteredQuery = showingArchivedTasks
      ? baseQuery.orderBy("archived")
      : baseQuery.where("archived", "==", false);
    const query = filteredQuery.orderBy("createdAt", "desc");

    return query.onSnapshot((ss) => {
      const userTasks = ss.docs.map((v) => ssToTask(v));
      setUserTasks(userTasks);
    });
  }, [userId, setUserTasks, showingArchivedTasks]);
}
