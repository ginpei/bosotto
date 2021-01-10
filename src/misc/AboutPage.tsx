import { Link } from "react-router-dom";
import { AppHeader } from "../shared/layouts/AppHeader";

export const AboutPage: React.FC = () => {
  return (
    <div className="AboutPage">
      <AppHeader />
      <div className="ui-container">
        <h1>About</h1>
        <p>
          <Link to="/">Home</Link>
        </p>
      </div>
    </div>
  );
};
