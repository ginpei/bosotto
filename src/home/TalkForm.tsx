import { Talk } from "../models/Talk";

export type OnTalkEvent = (talk: Talk) => void;

export const TalkForm: React.FC<{
  onSubmit: OnTalkEvent;
  onTalkChange: OnTalkEvent;
  talk: Talk;
}> = ({ onSubmit, onTalkChange, talk }) => {
  const onBodyChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTalkChange({
      ...talk,
      body: event.currentTarget.value,
    });
  };

  const onFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(talk);
  };

  return (
    <form className="TalkForm" onSubmit={onFormSubmit}>
      <p>
        <textarea value={talk.body} onChange={onBodyChange}></textarea>
      </p>
      <p>
        <button>Post</button>
      </p>
    </form>
  );
};
