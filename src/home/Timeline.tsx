import React, { useState } from "react";
import { connect } from "react-redux";
import { auth } from "../misc/firebase";
import { AppState } from "../models/appReducer";
import { useCurrentUserId } from "../models/CurrentUser";
import { createTalk, postTalk } from "../models/Talk";
import { OnTalkEvent, TalkForm } from "./TalkForm";
import "./Timeline.scss";
import { TimelineTalk } from "./TimelineTalk";

const mapState = (state: AppState) => ({
  talks: state.talks,
});

const TimelineInner: React.FC<ReturnType<typeof mapState>> = ({ talks }) => {
  const userId = useCurrentUserId();
  const [newTalk, setNewTalk] = useState(createTalk());
  const [submitting, setSubmitting] = useState(false);

  const onHeaderClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onNewTalkChange: OnTalkEvent = (talk) => {
    setNewTalk(talk);
  };

  const onNewTalkSubmit: OnTalkEvent = async (talk, currentTarget) => {
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

      if (currentTarget instanceof HTMLElement) {
        currentTarget.focus();
      }
    }
  };

  return (
    <section className="Timeline" data-focus-name="timeline">
      <header className="Timeline-header" onClick={onHeaderClick}>
        <h1 className="Timeline-title">Timeline</h1>
      </header>
      <div className="Timeline-input">
        <TalkForm
          disabled={Boolean(!userId || submitting)}
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

export const Timeline = connect(mapState)(TimelineInner);
