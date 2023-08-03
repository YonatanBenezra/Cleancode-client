// Styles
import "./side-bar.scss";

// Assets
import WhiteHome from "../../assets/whiteHome.svg";
import BlackHome from "../../assets/blackHome.svg";
import WhiteHtml from "../../assets/whiteHtml.svg";
import BlackHtml from "../../assets/blackHtml.svg";
import WhiteJs from "../../assets/whiteJs.svg";
import BlackJs from "../../assets/blackJs.svg";
import WhiteCss from "../../assets/whiteCss.svg";
import BlackCss from "../../assets/blackCss.svg";
import WhitePlus from "../../assets/whitePlus.svg";
import BlackPlus from "../../assets/blackPlus.svg";
import BlackLogin from "../../assets/darkLogin.png";
import WhiteLogin from "../../assets/whiteLogin.png";
import BlackUser from "../../assets/darkUser.png";
import WhiteUser from "../../assets/whiteUser.png";
import BlackLogout from "../../assets/darkLogout.png";
import WhiteLogout from "../../assets/whiteLogout.png";

// Context
import { useContext } from "react";
import GlobalContext from "../../contexts/Global-Context";

// Components
import { NavLink } from "react-router-dom";
import ThemeButton from "../themeButton/ThemeButton";
import Cookies from "js-cookie";

const icons = {
  Home: { dark: WhiteHome, light: BlackHome },
  HTML: { dark: WhiteHtml, light: BlackHtml },
  CSS: { dark: WhiteCss, light: BlackCss },
  JS: { dark: WhiteJs, light: BlackJs },
  Add: { dark: WhitePlus, light: BlackPlus },
  Login: { dark: WhiteLogin, light: BlackLogin },
  Logout: { dark: WhiteLogout, light: BlackLogout },
  Profile: { dark: WhiteUser, light: BlackUser },
};

const SideBar = () => {
  const { isCollapsed, setIsCollapsed, isDarkMode, user, setUser } =
    useContext(GlobalContext);
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "HTML", path: "/html" },
    { name: "CSS", path: "/css" },
    { name: "JS", path: "/javascript" },
    { name: "Add", path: "/add-exercise" },
  ];
  if (user._id) {
    navLinks.push(
      { name: "Profile", path: "/profile" },
      { name: "Logout", path: "/logout" }
    );
  } else {
    navLinks.push({ name: "Login", path: "/login" });
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const handleLogout = () => {
    Cookies.remove("token");
    setUser({});
  };

  return (
    <div className={`sidebar ${isCollapsed}`}>
      <div className="position-relative">
        <div className="sidebar-collapse" onClick={toggleSidebar}>
          {isCollapsed ? (
            <i className="fa-solid fa-less-than"></i>
          ) : (
            <i className="fa-solid fa-greater-than"></i>
          )}
        </div>
      </div>
      {user._id && (
        <div className="text-center mt-5">
          <img src={user.photo} alt={user.name} className="profile-img" />
          <h5 className="profile-title mt-2">
            <span className="name">{user.name.split(" ")[0]}</span>
          </h5>
        </div>
      )}
      <ThemeButton />
      <div className="sidebar-navlinks">
        {navLinks.map(({ name, path }) => (
          <div className="borderXwidth" key={path}>
            {name === "Logout" ? (
              <div onClick={handleLogout}>
                <div className="sidebar-navlink">
                  <img
                    src={isDarkMode ? icons[name].dark : icons[name].light}
                    alt={name}
                    className="sidebar-navlink-icon"
                  />
                  {isCollapsed && (
                    <div className="sidebar-navlink-text">
                      <span>{name}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <NavLink to={path}>
                <div className="sidebar-navlink">
                  <img
                    src={isDarkMode ? icons[name].dark : icons[name].light}
                    alt={name}
                    className="sidebar-navlink-icon"
                  />
                  {isCollapsed && (
                    <div className="sidebar-navlink-text">
                      <span>{name}</span>
                    </div>
                  )}
                </div>
              </NavLink>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
