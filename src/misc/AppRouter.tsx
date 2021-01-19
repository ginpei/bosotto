import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { HomePage } from "../home/HomePage";
import { AboutPage } from "./AboutPage";
import { NotFoundPage } from "./NotFoundPage";

export const AppRouter: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact={true} path="/about" component={AboutPage} />
        <Route exact={true} path="/" component={HomePage} />
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  );
};
