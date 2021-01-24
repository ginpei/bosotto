import { Provider } from "react-redux";
import { AppRouter } from "./misc/AppRouter";
import { useAppStore } from "./models/appReducer";

export const App: React.FC = () => {
  const store = useAppStore();

  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
};
