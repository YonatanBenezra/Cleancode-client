import "./side-bar.scss";
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
import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import GlobalContext from "../../contexts/Global-Context";

const SideBar = () => {
  const { isCollapsed, setIsCollapsed } = useContext(GlobalContext);

  const theme = useContext(GlobalContext);
  const navLinks = [
    { name: "Home", icon: theme.isDarkMode ? WhiteHome : BlackHome, path: "/home" },
    {
      name: "HTML",
      icon: theme.isDarkMode ? WhiteHtml : BlackHtml,
      path: "/html",
    },
    {
      name: "CSS",
      icon: theme.isDarkMode ? WhiteCss : BlackCss,
      path: "/css",
    },
    {
      name: "JS",
      icon: theme.isDarkMode ? WhiteJs : BlackJs,
      path: "/javascript",
    },
    {
      name: "Add",
      icon: theme.isDarkMode ? WhitePlus : BlackPlus,
      path: "/add-exercise",
    },
  ];
  return (
    <div className={`sidebar ${isCollapsed}`}>
      <div
        className="sidebar-collapse"
        onClick={() => {
          setIsCollapsed(!isCollapsed);
        }}
      >
        {isCollapsed ? "<" : ">"}
      </div>
      <ThemeButton />
      <div className="sidebar-header"></div>
      <div className="sidebar-navlinks">
        {navLinks.map((link) => (
          <div className="borderXwidth" key={link.path}>
            <NavLink to={link.path} >
              <div className="sidebar-navlink" key={link.name}>
                <div className="sidebar-navlink-icon">
                  <img src={link.icon} alt={link.name} />
                </div>
                {isCollapsed && (
                  <div className="sidebar-navlink-text">
                    <span>{link.name}</span>
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
