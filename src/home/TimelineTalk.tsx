import { Talk } from "../models/Talk";
import "./TimelineTalk.scss";

export const TimelineTalk: React.FC<{ talk: Talk }> = ({ talk }) => {
  const sDateTime = "2020/11/11";
  const userName = "Alice";

  return (
    <div className="TimelineTalk">
      <div className="TimelineTalk-header">
        <span className="TimelineTalk-name">{userName}</span>
        <span className="TimelineTalk-dateTime">{sDateTime}</span>
      </div>
      <div className="TimelineTalk-body">{talk.body}</div>
    </div>
  );
};
