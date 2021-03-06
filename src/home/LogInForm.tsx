import firebase from "firebase/app";
import { useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { auth } from "../misc/firebase";
import { isProd } from "../shared/env";

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
  const [error, setError] = useState<Error | null>(null);

  const onInputSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setError(null);
      await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
      setError(err);
    }
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
      {error && <p className="ui-errorAlert">{error.message}</p>}
      <p>
        <button>Log in</button>
      </p>
    </form>
  );
};
