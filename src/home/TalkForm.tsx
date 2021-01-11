import { Talk } from "../models/Talk";
import "./TalkForm.scss";

export type OnTalkEvent = (talk: Talk) => void;

export const TalkForm: React.FC<{
  disabled: boolean;
  onSubmit: OnTalkEvent;
  onTalkChange: OnTalkEvent;
  talk: Talk;
}> = ({ disabled, onSubmit, onTalkChange, talk }) => {
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
      <textarea
        className="TalkForm-body"
        disabled={disabled}
        onChange={onBodyChange}
        placeholder="How's it going?"
        value={talk.body}
      ></textarea>
      <div className="TalkForm-controls">
        <span></span>
        <button disabled={disabled}>Post</button>
      </div>
    </form>
  );
};
