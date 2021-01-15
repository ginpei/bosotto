import { OnTaskEvent, Task } from "../models/Task";
import "./TaskListItem.scss";

/**
 * Extends `<li>`
 */
export const TaskListItem: React.FC<{
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
    <li className="TaskListItem">
      <label>
        <span className="TaskListItem-checkboxWrapper">
          <input
            checked={task.complete}
            name="complete"
            onChange={onCheckboxClick}
            type="checkbox"
          />
        </span>
        {task.title}{" "}
        {!task.complete && (
          <>
            <button onClick={onStartClick}>Start</button>
            <button onClick={onStopClick}>Stop</button>
          </>
        )}
        <button onClick={onDeleteClick}>Delete</button>
      </label>
    </li>
  );
};
