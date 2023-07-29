import SideBar from "./components/sideBar/SideBar";
import { Outlet } from "react-router-dom";
import { useContext, useEffect } from "react";
import GlobalContext from "./contexts/Global-Context";
import "./App.scss";
const App = () => {
  const { isCollapsed, setIsCollapsed } = useContext(GlobalContext);
  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(!(window.innerWidth < 576));
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setIsCollapsed]);

  return (
    <div className={`app ${isCollapsed} d-flex`}>
      <SideBar />
      <div className="content-container">
        <Outlet />
      </div>
    </div>
  );
};

export default App;
