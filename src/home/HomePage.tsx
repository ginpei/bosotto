import { AppHeader } from "../shared/layouts/AppHeader";

export const HomePage: React.FC = () => {
  return (
    <div className="HomePage">
      <AppHeader />
      <div className="ui-container">
        <h1>Hello World!</h1>
      </div>
    </div>
  );
};
