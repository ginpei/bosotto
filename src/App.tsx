import { AppHeader } from "./shared/layouts/AppHeader";

export const App: React.FC = () => {
  return (
    <div className="App">
      <AppHeader />
      <div className="ui-container">
        <h1>Hello World!</h1>
      </div>
    </div>
  );
};
