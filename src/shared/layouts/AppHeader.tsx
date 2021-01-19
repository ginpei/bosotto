import { Link } from "react-router-dom";
import "./AppHeader.scss";

export const AppHeader: React.FC = () => {
  return (
    <div className="AppHeader">
      <div className="ui-container">
        <Link to="/">Bosotto</Link>
      </div>
    </div>
  );
};
