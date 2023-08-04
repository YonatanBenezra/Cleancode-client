import SideBar from "./components/sideBar/SideBar";
import { Outlet } from "react-router-dom";
import { useContext, useEffect } from "react";
import GlobalContext from "./contexts/Global-Context";
import "./App.scss";
import axios from "axios";
const App = () => {
  const { isCollapsed, setIsCollapsed, setUser } = useContext(GlobalContext);
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
  const token = localStorage.getItem("token");
  useEffect(() => {
    (async () => {
      if (token) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/users/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUser(response.data.data.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    })();
  }, [setUser, token]);
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
