import { useState } from "react";
import { auth } from "../misc/firebase";
import { AppHeader } from "../shared/layouts/AppHeader";
import "./HomePage.scss";
import { Timeline } from "./Timeline";

export const HomePage: React.FC = () => {
  const [email] = useState("test@example.com");
  const [password] = useState("123456");

  const onLogInClick = async () => {
    await auth.signInWithEmailAndPassword(email, password);
  };

  const onLogOutClick = async () => {
    await auth.signOut();
  };

  return (
    <div className="HomePage">
      <AppHeader />
      <div className="HomePage-frame ui-container">
        <div className="HomePage-timeline">
          <Timeline />
        </div>
        <div className="HomePage-account">
          <section>
            <h2>Authentication</h2>
            <p>
              <button onClick={onLogInClick}>Log in</button>
              <button onClick={onLogOutClick}>Log out</button>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
