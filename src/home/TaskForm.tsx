import { Task } from "../models/Task";

export type OnTaskEvent = (task: Task, currentTarget: EventTarget) => void;

export const TaskForm: React.FC<{
  disabled: boolean;
  onChange: OnTaskEvent;
  onSubmit: OnTaskEvent;
  task: Task;
}> = ({ disabled, onChange, onSubmit, task }) => {
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    if (name === "title") {
      onChange({ ...task, title: value }, event.currentTarget);
      return;
    }

    throw new Error(`Unknown name "${name}"`);
  };

  const onFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onSubmit(task, event.currentTarget);
  };

  return (
    <form className="TaskForm" onSubmit={onFormSubmit}>
      <label>
        Title:{" "}
        <input
          disabled={disabled}
          name="title"
          onChange={onInputChange}
          type="text"
          value={task.title}
        />
      </label>
      <button disabled={disabled}>Add</button>
    </form>
  );
};
