import { Provider } from "react-redux";
import { AppRouter } from "./misc/AppRouter";
import { appStore } from "./models/appReducer";

export const App: React.FC = () => {
  return (
    <Provider store={appStore}>
      <AppRouter />
    </Provider>
  );
};
