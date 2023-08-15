import { useContext } from "react";
import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import GlobalContext from "../contexts/Global-Context";

function AdminRoute({ children }) {
  const { user } = useContext(GlobalContext);
  const location = useLocation();

  if (user.role === "admin") {
    return children;
  }

  return <Navigate to="/login" replace state={{ from: location }} />;
}

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminRoute;
