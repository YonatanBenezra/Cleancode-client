import { useContext } from "react";
import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import GlobalContext from "../contexts/Global-Context";

function PrivateRoute({ children, restrictedTo }) {
  const { user } = useContext(GlobalContext);
  const location = useLocation();

  if (!user.loaded) return null;
  if (restrictedTo.includes(user.role)) {
    return children;
  }

  return <Navigate to="/login" replace state={{ from: location }} />;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  restrictedTo: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PrivateRoute;
