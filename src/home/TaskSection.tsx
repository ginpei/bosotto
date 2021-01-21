import { useEffect, useState } from "react";
import { noop } from "../misc/misc";
import { useCurrentUserId } from "../models/CurrentUser";
import { createTalk, postTalk } from "../models/Talk";
import {
  archiveTasks,
  completeTask,
  createTask,
  deleteTask,
  getUserTaskCollection,
  OnTaskEvent,
  postTask,
  ssToTask,
  Task,
} from "../models/Task";
import { DashboardSection } from "./Dashboard";
import { TaskForm } from "./TaskForm";
import { TaskArchivedListItem, TaskListItem } from "./TaskListItem";
import "./TaskSection.scss";

export const TaskSection: React.FC = () => {
  const userId = useCurrentUserId();
  const [newTask, setNewTask] = useState(createTask());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showingArchived, setShowingArchived] = useState(false);

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
    setShowingArchived(event.currentTarget.checked);
  };

  const onArchiveCompletesClick = () => {
    archiveTasks(tasks.filter((v) => !v.archived && v.complete));
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

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      return noop;
    }

    const coll = getUserTaskCollection(userId);
    const coll2 = showingArchived
      ? coll.orderBy("archived")
      : coll.where("archived", "==", false);
    return coll2.orderBy("createdAt", "desc").onSnapshot((ss) => {
      const list = ss.docs.map((v) => ssToTask(v));
      setTasks(list);
    });
  }, [userId, showingArchived]);

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
            checked={showingArchived}
            name="showingArchived"
            onChange={onShowArchivedChange}
            type="checkbox"
          />{" "}
          Show archived
        </label>
        <button onClick={onArchiveCompletesClick}>Archive all completes</button>
      </p>
      <ul className="TaskSection-taskList">
        {tasks.map((task) =>
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
