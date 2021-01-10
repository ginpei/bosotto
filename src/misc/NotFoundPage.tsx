import { Link } from "react-router-dom";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="NotFoundPage">
      <div className="ui-container">
        <h1>Not found</h1>
        <p>
          <Link to="/">Home</Link>
        </p>
      </div>
    </div>
  );
};
