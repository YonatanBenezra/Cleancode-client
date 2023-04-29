import SideBar from "./components/sideBar/SideBar";
import { Navigate, Outlet } from "react-router-dom";
import { useContext, useEffect } from "react";
import GlobalContext from "./contexts/Global-Context";
import "./App.scss";
const App = () => {
  const { isCollapsed, setIsCollapsed } = useContext(GlobalContext);
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsCollapsed(false);
    }
  }, []);
  return (
    <div className={`app ${isCollapsed}`}>
      <SideBar />
      <div className="content-container">
        <Outlet />
      </div>
    </div>
  );
};

export default App;
