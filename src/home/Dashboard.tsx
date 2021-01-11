import { useEffect, useState } from "react";
import { auth } from "../misc/firebase";

interface LoginInput {
  email: string;
  password: string;
}

type OnLoginInputEvent = (input: LoginInput) => void;

export const Dashboard: React.FC = () => {
  const [userId, setUserId] = useState(auth.currentUser?.uid);
  const [loginInput, setLoginInput] = useState<LoginInput>({
    email: "",
    password: "",
  });

  const onLoginInputChange: OnLoginInputEvent = (input) => {
    setLoginInput(input);
  };

  const onLoginSubmit = async () => {
    const { email, password } = loginInput;
    await auth.signInWithEmailAndPassword(email, password);
  };

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
        <LoginForm
          input={loginInput}
          onChange={onLoginInputChange}
          onSubmit={onLoginSubmit}
        />
      )}
    </section>
  );
};

const LoginForm: React.FC<{
  input: LoginInput;
  onChange: OnLoginInputEvent;
  onSubmit: OnLoginInputEvent;
}> = ({ input, onChange, onSubmit }) => {
  const onInputSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(input);
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    if (name === "email") {
      onChange({
        ...input,
        email: value,
      });
      return;
    }

    if (name === "password") {
      onChange({
        ...input,
        password: value,
      });
      return;
    }

    throw new Error(`Unknown input "${name}"`);
  };

  return (
    <form className="LoginForm" onSubmit={onInputSubmit}>
      <label>
        Email:{" "}
        <input
          name="email"
          onChange={onInputChange}
          type="email"
          value={input.email}
        />
      </label>
      <label>
        Password:{" "}
        <input
          name="password"
          onChange={onInputChange}
          type="password"
          value={input.password}
        />
      </label>
      <p>
        <button>Log in</button>
      </p>
    </form>
  );
};
