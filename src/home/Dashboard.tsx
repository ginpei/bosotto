import { useState } from "react";
import { auth } from "../misc/firebase";

export const Dashboard: React.FC = () => {
  const [email] = useState("test@example.com");
  const [password] = useState("123456");

  const onLogInClick = async () => {
    await auth.signInWithEmailAndPassword(email, password);
  };

  const onLogOutClick = async () => {
    await auth.signOut();
  };

  return (
    <section className="Dashboard">
      <h1>Dashboard</h1>
      <p>
        <button onClick={onLogInClick}>Log in</button>
        <button onClick={onLogOutClick}>Log out</button>
      </p>
    </section>
  );
};
