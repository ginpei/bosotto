import { useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { appSlice, AppState } from "../models/appReducer";
import { useCurrentUserId } from "../models/CurrentUser";
import { createTalk, postTalk } from "../models/Talk";
import {
  archiveTasks,
  completeTask,
  createTask,
  deleteTask,
  OnTaskEvent,
  postTask,
  Task,
} from "../models/Task";
import { DashboardSection } from "./Dashboard";
import { TaskForm } from "./TaskForm";
import { TaskArchivedListItem, TaskListItem } from "./TaskListItem";
import "./TaskSection.scss";

const mapState = (state: AppState) => ({
  userTasks: state.userTasks,
  showingArchivedTasks: state.showingArchivedTasks,
});

const mapDispatch = (dispatch: Dispatch) => ({
  setShowingArchivedTasks: (show: boolean) =>
    dispatch(appSlice.actions.setShowingArchivedTasks({ show })),
});

const TaskSectionInner: React.FC<
  ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>
> = ({ setShowingArchivedTasks, showingArchivedTasks, userTasks }) => {
  const userId = useCurrentUserId();
  const [newTask, setNewTask] = useState(createTask());
  const [submitting, setSubmitting] = useState(false);

  const onNewTaskChange: OnTaskEvent = (task) => {
    setNewTask(task);
  };

  const onNewTaskSubmit: OnTaskEvent = async (task, elForm) => {
    if (!userId) {
      return;
    }

    setSubmitting(true);
    try {
      await postTask(userId, task);
    } finally {
      setSubmitting(false);
      setNewTask(createTask());

      if (elForm instanceof HTMLFormElement) {
        elForm.reset();

        const elInput = elForm.querySelector("input");
        if (elInput) {
          elInput.focus();
        }
      }
    }
  };

  const onShowArchivedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowingArchivedTasks(event.currentTarget.checked);
  };

  const onArchiveCompletesClick = () => {
    archiveTasks(userTasks.filter((v) => !v.archived && v.complete));
  };

  const onTaskComplete: OnTaskEvent = async (task: Task) => {
    completeTask(task, !task.complete);
  };

  const onTaskStart: OnTaskEvent = (task: Task) => {
    if (!userId) {
      return;
    }

    const body = `Started ${task.title}`;
    const talk = createTalk({ body });
    postTalk(userId, talk);
  };

  const onTaskStop: OnTaskEvent = (task: Task) => {
    if (!userId) {
      return;
    }

    const body = `Stopped ${task.title}`;
    const talk = createTalk({ body });
    postTalk(userId, talk);
  };

  const onTaskDelete: OnTaskEvent = (task: Task) => {
    // eslint-disable-next-line no-alert
    const ok = window.confirm(
      `Are you sure you want to delete this task?\n\n${task.title}`
    );
    if (ok) {
      deleteTask(task);
    }
  };

  return (
    <DashboardSection className="TaskSection" title="Tasks">
      <TaskForm
        disabled={Boolean(!userId || submitting)}
        onChange={onNewTaskChange}
        onSubmit={onNewTaskSubmit}
        task={newTask}
      />
      <p>
        <label>
          <input
            checked={showingArchivedTasks}
            name="showingArchived"
            onChange={onShowArchivedChange}
            type="checkbox"
          />{" "}
          Show archived
        </label>
        <button onClick={onArchiveCompletesClick}>Archive all completes</button>
      </p>
      <ul className="TaskSection-taskList">
        {/* TODO filter by archived */}
        {userTasks.map((task) =>
          task.archived ? (
            <TaskArchivedListItem task={task} />
          ) : (
            <TaskListItem
              key={task.id}
              onCompleteToggle={onTaskComplete}
              onDelete={onTaskDelete}
              onStart={onTaskStart}
              onStop={onTaskStop}
              task={task}
            />
          )
        )}
      </ul>
    </DashboardSection>
  );
};

export const TaskSection = connect(mapState, mapDispatch)(TaskSectionInner);
