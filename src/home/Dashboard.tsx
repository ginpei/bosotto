import { useEffect, useState } from "react";
import { auth } from "../misc/firebase";
import { LogInForm } from "./LogInForm";
import { TaskList } from "./TaskList";

export const Dashboard: React.FC = () => {
  const [userId, setUserId] = useState(auth.currentUser?.uid);

  const onLogOutClick = async () => {
    await auth.signOut();
  };

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setUserId(user?.uid);
    });
  }, []);

  return (
    <section className="Dashboard">
      <h1>Dashboard</h1>
      {userId ? (
        <p>
          <button onClick={onLogOutClick}>Log out</button>
        </p>
      ) : (
        <LogInForm />
      )}
      <section>
        <h2>Tasks</h2>
        <TaskList />
      </section>
    </section>
  );
};
