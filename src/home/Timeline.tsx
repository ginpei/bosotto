import React, { useEffect, useState } from "react";
import { auth } from "../misc/firebase";
import { noop } from "../misc/misc";
import {
  createTalk,
  getUserTalkCollection,
  postTalk,
  ssToTalk,
  Talk,
} from "../models/Talk";
import { OnTalkEvent, TalkForm } from "./TalkForm";
import "./Timeline.scss";
import { TimelineTalk } from "./TimelineTalk";

export const Timeline: React.FC = () => {
  const [userId, setUserId] = useState(auth.currentUser?.uid);
  const [newTalk, setNewTalk] = useState(createTalk());
  const [talks, setTalks] = useState<Talk[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const onHeaderClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    <section className="Timeline">
      <header className="Timeline-header" onClick={onHeaderClick}>
        <h1 className="Timeline-title">Timeline</h1>
      </header>
      <div className="Timeline-input">
        <TalkForm
          disabled={submitting}
          onSubmit={onNewTalkSubmit}
          onTalkChange={onNewTalkChange}
          talk={newTalk}
        />
      </div>
      {talks.map((talk) => (
        <div className="Timeline-talkItem" key={talk.id}>
          <TimelineTalk key={talk.id} talk={talk} />
        </div>
      ))}
      <p>No more talks.</p>
    </section>
  );
};
