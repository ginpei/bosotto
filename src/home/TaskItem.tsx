import { OnTaskEvent, Task } from "../models/Task";

export const TaskItem: React.FC<{
  onComplete: OnTaskEvent;
  onDelete: OnTaskEvent;
  onIncomplete: OnTaskEvent;
  onStart: OnTaskEvent;
  onStop: OnTaskEvent;
  task: Task;
}> = ({ onComplete, onDelete, onIncomplete, onStart, onStop, task }) => {
  const onStartClick = () => {
    onStart(task);
  };

  const onStopClick = () => {
    onStop(task);
  };

  const onIncompleteClick = () => {
    onIncomplete(task);
  };

  const onCompleteClick = () => {
    onComplete(task);
  };

  const onDeleteClick = () => {
    onDelete(task);
  };

  return (
    <div className="TaskItem">
      {task.title} <button onClick={onStartClick}>Start</button>
      <button onClick={onStopClick}>Stop</button>
      {task.complete ? (
        <button onClick={onIncompleteClick}>Incomplete</button>
      ) : (
        <button onClick={onCompleteClick}>Complete</button>
      )}
      <button onClick={onDeleteClick}>Delete</button>
    </div>
  );
};
