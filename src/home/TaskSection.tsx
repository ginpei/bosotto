import { useEffect, useState } from "react";
import { noop } from "../misc/misc";
import { useCurrentUserId } from "../models/CurrentUser";
import { createTalk, postTalk } from "../models/Talk";
import {
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
import { TaskItem } from "./TaskItem";

export const TaskSection: React.FC = () => {
  const userId = useCurrentUserId();
  const [newTask, setNewTask] = useState(createTask());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [hidingComplete, setFilteringComplete] = useState(false);

  const availableTasks = hidingComplete
    ? tasks.filter((v) => !v.complete)
    : tasks;

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

  const onHidingCompleteChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilteringComplete(event.currentTarget.checked);
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

    return getUserTaskCollection(userId)
      .orderBy("createdAt", "desc")
      .onSnapshot((ss) => {
        const list = ss.docs.map((v) => ssToTask(v));
        setTasks(list);
      });
  }, [userId]);

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
            checked={hidingComplete}
            name="hidingComplete"
            onChange={onHidingCompleteChange}
            type="checkbox"
          />{" "}
          Hide complete
        </label>
      </p>
      <ul>
        {availableTasks.map((task) => (
          <li key={task.id}>
            <TaskItem
              onCompleteToggle={onTaskComplete}
              onDelete={onTaskDelete}
              onStart={onTaskStart}
              onStop={onTaskStop}
              task={task}
            />
          </li>
        ))}
      </ul>
    </DashboardSection>
  );
};
