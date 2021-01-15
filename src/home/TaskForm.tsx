import { OnTaskEvent, Task } from "../models/Task";
import { InputField } from "../shared/pure/InputField";
import "./TaskForm.scss";

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
      <input
        data-focus-name="taskInput"
        disabled={disabled}
        name="title"
        onChange={onInputChange}
        placeholder="Something to do"
        type="text"
        value={task.title}
      />
      <button disabled={disabled}>Add</button>
    </form>
  );
};
