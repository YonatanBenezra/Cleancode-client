import SideBar from "./components/sideBar/SideBar";
import { Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import GlobalContext from "./contexts/Global-Context";
import "./App.scss";
import axios from "axios";
import WelcomeModal from "./components/modals/welcomeModal";
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
          setUser({ ...response.data.data.data, loaded: true });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser({ loaded: true });
      }
    })();
  }, [setUser, token]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  useEffect(() => {
    handleShow();
  }, []);

  return (
    <div className={`app ${isCollapsed} d-flex`}>
      <SideBar />
      <div className="content-container">
        <Outlet />
        <WelcomeModal handleClose={handleClose} show={show} />
      </div>
    </div>
  );
};

export default App;
