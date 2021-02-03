import { jcn } from "../misc/misc";
import { AccountSection } from "./AccountSection";
import "./Dashboard.scss";
import { TaskSection } from "./TaskSection";

export const Dashboard: React.FC = () => {
  return (
    <section className="Dashboard" data-focus-name="dashboard">
      <header className="Dashboard-header ui-container">
        <h1 className="Dashboard-title">Dashboard</h1>
      </header>
      <AccountSection />
      <TaskSection />
    </section>
  );
};

/**
 * A section in dashboard.
 */
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
