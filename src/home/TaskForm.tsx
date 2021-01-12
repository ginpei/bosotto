import { Task } from "../models/Task";
import { InputField } from "../shared/pure/InputField";
import "./TaskForm.scss";

export type OnTaskEvent = (task: Task, currentTarget?: EventTarget) => void;

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
      <InputField
        disabled={disabled}
        label="Title"
        name="title"
        onChange={onInputChange}
        type="text"
        value={task.title}
      />
      <div style={{ textAlign: "right" }}>
        <button disabled={disabled}>Add</button>
      </div>
    </form>
  );
};
