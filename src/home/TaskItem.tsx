import { OnTaskEvent, Task } from "../models/Task";

export const TaskItem: React.FC<{
  onCompleteToggle: OnTaskEvent;
  onDelete: OnTaskEvent;
  onStart: OnTaskEvent;
  onStop: OnTaskEvent;
  task: Task;
}> = ({ onCompleteToggle, onDelete, onStart, onStop, task }) => {
  const onStartClick = () => {
    onStart(task);
  };

  const onStopClick = () => {
    onStop(task);
  };

  const onCheckboxClick = () => {
    onCompleteToggle(task);
  };

  const onDeleteClick = () => {
    onDelete(task);
  };

  return (
    <label className="TaskItem">
      <input
        checked={task.complete}
        name="complete"
        onChange={onCheckboxClick}
        type="checkbox"
      />
      {task.title} <button onClick={onStartClick}>Start</button>
      <button onClick={onStopClick}>Stop</button>
      <button onClick={onDeleteClick}>Delete</button>
    </label>
  );
};
