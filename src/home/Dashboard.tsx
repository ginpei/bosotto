import { jcn } from "../misc/misc";
import "./Dashboard.scss";
import { DashboardAccountSection } from "./DashboardAccountSection";
import { DashboardTaskSection } from "./DashboardTaskSection";

export const Dashboard: React.FC = () => {
  return (
    <section className="Dashboard">
      <header className="Dashboard-header ui-container">
        <h1 className="Dashboard-title">Dashboard</h1>
      </header>
      <DashboardAccountSection />
      <DashboardTaskSection />
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
