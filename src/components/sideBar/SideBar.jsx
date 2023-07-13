import "./side-bar.scss";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import GlobalContext from "../../contexts/Global-Context";
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
import ThemeButton from "../themeButton/ThemeButton";

const SideBar = () => {
  const { isCollapsed, setIsCollapsed, isDarkMode } = useContext(GlobalContext);

  const navLinks = [
    { name: "Home", icon: isDarkMode ? WhiteHome : BlackHome, path: "/home" },
    { name: "HTML", icon: isDarkMode ? WhiteHtml : BlackHtml, path: "/html" },
    { name: "CSS", icon: isDarkMode ? WhiteCss : BlackCss, path: "/css" },
    { name: "JS", icon: isDarkMode ? WhiteJs : BlackJs, path: "/javascript" },
    {
      name: "Add",
      icon: isDarkMode ? WhitePlus : BlackPlus,
      path: "/add-exercise",
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed}`}>
      <div className="sidebar-collapse" onClick={toggleSidebar}>
        {isCollapsed ? "<" : ">"}
      </div>
      <ThemeButton />
      <div className="sidebar-header"></div>
      <div className="sidebar-navlinks">
        {navLinks.map(({ name, icon, path }) => (
          <div className="borderXwidth" key={path}>
            <NavLink to={path}>
              <div className="sidebar-navlink">
                <div className="sidebar-navlink-icon">
                  <img src={icon} alt={name} />
                </div>
                {isCollapsed && (
                  <div className="sidebar-navlink-text">
                    <span>{name}</span>
                  </div>
                )}
              </div>
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
