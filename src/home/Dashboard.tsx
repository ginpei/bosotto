import { connect } from "react-redux";
import { Dispatch } from "redux";
import { jcn } from "../misc/misc";
import { appSlice, AppState } from "../models/appReducer";
import { AccountSection } from "./AccountSection";
import "./Dashboard.scss";
import { TaskSection } from "./TaskSection";

export const Dashboard: React.FC = () => {
  return (
    <section className="Dashboard" data-focus-name="dashboard">
      <header className="Dashboard-header ui-container">
        <h1 className="Dashboard-title">Dashboard</h1>
      </header>
      <CounterSection2 />
      <AccountSection />
      <TaskSection />
    </section>
  );
};

export const DashboardSection: React.FC<{
  className?: string;
  title: string;
}> = ({ children, className, title }) => {
  return (
    <section
      className={jcn("Dashboard-DashboardSection ui-container", className)}
    >
      <h2 className="Dashboard-DashboardSection-title">{title}</h2>
      {children}
    </section>
  );
};

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;

const CounterSection: React.FC<StateProps & DispatchProps> = ({
  count,
  focus,
  decrement,
  increment,
}) => {
  return (
    <DashboardSection className="MyApp ui-container" title="Counter">
      <p>Focus: "{focus}"</p>
      <p>{count}</p>
      <p>
        <button onClick={increment}>+1</button>
        <button onClick={decrement}>-1</button>
      </p>
    </DashboardSection>
  );
};

const mapState = (state: AppState) => ({
  count: state.count,
  focus: state.focus,
});

const mapDispatch = (dispatch: Dispatch<{ type: string }>) => ({
  increment: () => dispatch(appSlice.actions.increase()),
  decrement: () => dispatch(appSlice.actions.decrease()),
});

const CounterSection2 = connect(mapState, mapDispatch)(CounterSection);
