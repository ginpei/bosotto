import { useEffect, useState } from "react";
import { auth } from "../misc/firebase";
import { noop } from "../misc/misc";
import { createTalk, postTalk } from "../models/Talk";
import {
  createTask,
  deleteTask,
  getUserTaskCollection,
  postTask,
  ssToTask,
  Task,
} from "../models/Task";
import { DashboardSection } from "./Dashboard";
import { OnTaskEvent, TaskForm } from "./TaskForm";

export const DashboardTaskSection: React.FC = () => {
  const [userId, setUserId] = useState(auth.currentUser?.uid);
  const [newTask, setNewTask] = useState(createTask());
  const [tasks, setTasks] = useState<Task[]>([]);
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
    return auth.onAuthStateChanged((user) => {
      setUserId(user?.uid);
    });
  }, []);

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
    <DashboardSection className="DashboardTaskSection" title="Tasks">
      <TaskForm
        disabled={submitting}
        onChange={onNewTaskChange}
        onSubmit={onNewTaskSubmit}
        task={newTask}
      />
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <TaskItem
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

const TaskItem: React.FC<{
  onDelete: OnTaskEvent;
  onStart: OnTaskEvent;
  onStop: OnTaskEvent;
  task: Task;
}> = ({ onDelete, onStart, onStop, task }) => {
  const onStartClick = () => {
    onStart(task);
  };

  const onStopClick = () => {
    onStop(task);
  };

  const onDeleteClick = () => {
    onDelete(task);
  };

  return (
    <div className="TaskItem">
      {task.title} <button onClick={onStartClick}>Start</button>{" "}
      <button onClick={onStopClick}>Stop</button>{" "}
      <button onClick={onDeleteClick}>Delete</button>
    </div>
  );
};
