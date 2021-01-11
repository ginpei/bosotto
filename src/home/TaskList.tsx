import { useEffect, useState } from "react";
import { auth } from "../misc/firebase";
import { noop } from "../misc/misc";
import {
  createTask,
  getUserTaskCollection,
  postTask,
  ssToTask,
  Task,
} from "../models/Task";
import { OnTaskEvent, TaskForm } from "./TaskForm";

export const TaskList: React.FC = () => {
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
    <section className="TaskList">
      <h2>Tasks</h2>
      <TaskForm
        disabled={submitting}
        onChange={onNewTaskChange}
        onSubmit={onNewTaskSubmit}
        task={newTask}
      />
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <TaskItem task={task} />
          </li>
        ))}
      </ul>
    </section>
  );
};

const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
  return <div className="TaskItem">{task.title}</div>;
};
