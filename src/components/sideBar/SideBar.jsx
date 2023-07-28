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

// Context
import { useContext } from "react";
import GlobalContext from "../../contexts/Global-Context";

// Components
import { NavLink } from "react-router-dom";
import ThemeButton from "../themeButton/ThemeButton";

const icons = {
  Home: { dark: WhiteHome, light: BlackHome },
  HTML: { dark: WhiteHtml, light: BlackHtml },
  CSS: { dark: WhiteCss, light: BlackCss },
  JS: { dark: WhiteJs, light: BlackJs },
  Add: { dark: WhitePlus, light: BlackPlus },
};

const SideBar = () => {
  const { isCollapsed, setIsCollapsed, isDarkMode } = useContext(GlobalContext);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "HTML", path: "/html" },
    { name: "CSS", path: "/css" },
    { name: "JS", path: "/javascript" },
    { name: "Add", path: "/add-exercise" },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
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
      <ThemeButton />
      <div className="sidebar-header"></div>
      <div className="sidebar-navlinks">
        {navLinks.map(({ name, path }) => (
          <div className="borderXwidth" key={path}>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
