import NiceMarkdown from "@ginpei/react-nice-markdown";
import dayjs from "dayjs";
import { Timestamp } from "../misc/firebase";
import { Talk } from "../models/Talk";
import "./TimelineTalk.scss";

export const TimelineTalk: React.FC<{ talk: Talk }> = ({ talk }) => {
  const sDateTime = getDateTimeString(talk.createdAt);
  const userName = "Alice";

  return (
    <div className="TimelineTalk">
      <div className="TimelineTalk-header">
        <span className="TimelineTalk-name">{userName}</span>
        <span className="TimelineTalk-dateTime">{sDateTime}</span>
      </div>
      <div className="TimelineTalk-body">
        <NiceMarkdown content={talk.body} />
      </div>
    </div>
  );
};

function getDateTimeString(timestamp: Timestamp) {
  const d = dayjs(timestamp.toDate());

  const isToday = d.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");
  if (isToday) {
    return d.format("hh:mm A");
  }

  return d.format("YYYY-MM-DD HH:mm");
}
