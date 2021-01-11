import { useEffect, useState } from "react";
import { auth } from "../misc/firebase";
import { noop } from "../misc/misc";
import { getUserTaskCollection, ssToTask, Task } from "../models/Task";

export const TaskList: React.FC = () => {
  const [userId, setUserId] = useState(auth.currentUser?.uid);
  const [tasks, setTasks] = useState<Task[]>([]);

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
