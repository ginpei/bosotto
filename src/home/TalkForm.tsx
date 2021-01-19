import { Talk } from "../models/Talk";
import "./TalkForm.scss";

export type OnTalkEvent = (talk: Talk, currentTarget: EventTarget) => void;

export const TalkForm: React.FC<{
  disabled: boolean;
  onSubmit: OnTalkEvent;
  onTalkChange: OnTalkEvent;
  talk: Talk;
}> = ({ disabled, onSubmit, onTalkChange, talk }) => {
  const onBodyChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTalkChange(
      {
        ...talk,
        body: event.currentTarget.value,
      },
      event.currentTarget
    );
  };

  const onKeyPress = (event: React.KeyboardEvent) => {
    const isCtrlEnter =
      event.key === "\n" && event.ctrlKey && !event.shiftKey && !event.altKey;
    if (isCtrlEnter) {
      onSubmit(talk, event.currentTarget);
    }
  };

  const onFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(talk, event.currentTarget);
  };

  return (
    <form className="TalkForm" onSubmit={onFormSubmit}>
      <textarea
        className="TalkForm-body"
        data-focus-name="talkInput"
        disabled={disabled}
        onChange={onBodyChange}
        onKeyPress={onKeyPress}
        placeholder="How's it going?"
        value={talk.body}
      ></textarea>
      <div className="TalkForm-controls">
        <span></span>
        <button disabled={disabled}>
          Post <small>(Ctrl+Enter)</small>
        </button>
      </div>
    </form>
  );
};
