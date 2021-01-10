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

const AppHeader: React.FC = () => {
  return (
    <div className="AppHeader">
      <div className="ui-container">Bosotto</div>
    </div>
  );
};
