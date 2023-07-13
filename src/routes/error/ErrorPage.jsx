import { Link } from "react-router-dom";
import "./error-page.scss";

const ErrorPage = () => {
  return (
    <div className="error-container">
      <h1 className="error-heading">Coming Soon!</h1>
      <h2 className="error-subheading">We are still working on this page</h2>
      <Link to="/javaScript" className="error-button">
        Try out our Javascript Exercises
      </Link>
    </div>
  );
};

export default ErrorPage;
