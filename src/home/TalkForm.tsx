import { Talk } from "../models/Talk";

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
      <p>
        <textarea
          disabled={disabled}
          onChange={onBodyChange}
          value={talk.body}
        ></textarea>
      </p>
      <p>
        <button disabled={disabled}>Post</button>
      </p>
    </form>
  );
};
