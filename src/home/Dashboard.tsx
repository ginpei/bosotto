import { useEffect, useState } from "react";
import { auth } from "../misc/firebase";
import "./Dashboard.scss";
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
      <header className="Dashboard-header ui-container">
        <h1 className="Dashboard-title">Dashboard</h1>
      </header>
      <section className="ui-container">
        <h2 className="Dashboard-heading">Account</h2>
        {userId ? (
          <p>
            <button onClick={onLogOutClick}>Log out</button>
          </p>
        ) : (
          <LogInForm />
        )}
      </section>
      <section className="ui-container">
        <h2 className="Dashboard-heading">Tasks</h2>
        <TaskList />
      </section>
    </section>
  );
};
