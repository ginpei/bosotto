import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../misc/firebase";
import { noop } from "../misc/misc";
import {
  createTalk,
  getUserTalkCollection,
  postTalk,
  ssToTalk,
  Talk,
} from "../models/Talk";
import { AppHeader } from "../shared/layouts/AppHeader";
import { OnTalkEvent, TalkForm } from "./TalkForm";

export const HomePage: React.FC = () => {
  const [userId, setUserId] = useState(auth.currentUser?.uid);
  const [email] = useState("test@example.com");
  const [password] = useState("123456");
  const [newTalk, setNewTalk] = useState(createTalk());
  const [talks, setTalks] = useState<Talk[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const onLogInClick = async () => {
    await auth.signInWithEmailAndPassword(email, password);
  };

  const onLogOutClick = async () => {
    await auth.signOut();
  };

  const onNewTalkChange: OnTalkEvent = (talk) => {
    setNewTalk(talk);
  };

  const onNewTalkSubmit: OnTalkEvent = async (talk) => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      return;
    }

    setSubmitting(true);
    try {
      await postTalk(uid, talk);
      setNewTalk(createTalk());
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setUserId(user?.uid);
    });
  }, []);

  useEffect(() => {
    if (!userId) {
      setTalks([]);
      return noop;
    }

    return getUserTalkCollection(userId)
      .orderBy("createdAt", "desc")
      .onSnapshot((ss) => {
        const list = ss.docs.map((v) => ssToTalk(v));
        setTalks(list);
      });
  }, [userId]);

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
        <section className="HomePage-timeline">
          <TalkForm
            disabled={submitting}
            onSubmit={onNewTalkSubmit}
            onTalkChange={onNewTalkChange}
            talk={newTalk}
          />
          {talks.map((talk) => (
            <TimelineTalk key={talk.id} talk={talk} />
          ))}
        </section>
      </div>
    </div>
  );
};

const TimelineTalk: React.FC<{ talk: Talk }> = ({ talk }) => {
  return (
    <div
      className="TimelineTalk"
      style={{ border: "solid 1px gray", margin: "1rem 0", padding: "1rem" }}
    >
      {talk.body}
    </div>
  );
};
