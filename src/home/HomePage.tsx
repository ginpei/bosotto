import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../misc/firebase";
import { AppHeader } from "../shared/layouts/AppHeader";

export const HomePage: React.FC = () => {
  const [email] = useState("test@example.com");
  const [password] = useState("123456");

  const onLogInClick = async () => {
    console.log(`# auth...`);
    await auth.signInWithEmailAndPassword(email, password);
    console.log(`# auth done.`);
  };

  const onLogOutClick = async () => {
    await auth.signOut();
  };

  const onFetchDataClick = async () => {
    console.log(`# data...`);
    const ss = await db.collection("items").get();
    const dataList = ss.docs.map((v) => ({ id: v.id, ...v.data() }));
    console.log("# dataList", dataList);
    console.log(`# data done.`);
  };

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      console.log(`# user`, user);
    });
  }, []);

  return (
    <div className="HomePage">
      <AppHeader />
      <div className="ui-container">
        <h1>Hello World!</h1>
        <p>
          <Link to="/about">About</Link>
        </p>
        <section>
          <h2>Authentication</h2>
          <p>
            <button onClick={onLogInClick}>Log in</button>
            <button onClick={onLogOutClick}>Log out</button>
          </p>
        </section>
        <section>
          <h2>Firestore</h2>
          <p>
            <button onClick={onFetchDataClick}>Fetch data</button>
          </p>
        </section>
      </div>
    </div>
  );
};
