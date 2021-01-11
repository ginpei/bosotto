import firebase from "firebase/app";
import { useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { auth } from "../misc/firebase";

const uiConfig = {
  signInFlow: "popup",
  signInSuccessUrl: "/",
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
};

export const LogInForm: React.FC = () => {
  // TODO extract
  const isProd = window.location.hostname !== "localhost";

  return (
    <div className="LogInForm">
      {isProd ? <ProdLogInForm /> : <DevLogInForm />}
    </div>
  );
};

export const ProdLogInForm: React.FC = () => {
  return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />;
};

const DevLogInForm: React.FC = () => {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("123456");

  const onInputSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    await auth.signInWithEmailAndPassword(email, password);
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    if (name === "email") {
      setEmail(value);
      return;
    }

    if (name === "password") {
      setPassword(value);
      return;
    }

    throw new Error(`Unknown input "${name}"`);
  };

  return (
    <form className="LoginForm" onSubmit={onInputSubmit}>
      <p>
        <strong>* Dev login</strong>
      </p>
      <label>
        Email:{" "}
        <input
          name="email"
          onChange={onInputChange}
          type="email"
          value={email}
        />
      </label>
      <label>
        Password:{" "}
        <input
          name="password"
          onChange={onInputChange}
          type="password"
          value={password}
        />
      </label>
      <p>
        <button>Log in</button>
      </p>
    </form>
  );
};
