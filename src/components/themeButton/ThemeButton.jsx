import "./theme-button.scss";
import { useContext } from "react";
import GlobalContext from "../../contexts/Global-Context";

const ThemeButton = () => {
  const { isDarkMode, setIsDarkMode } = useContext(GlobalContext);
  return (
    <div className="theme-container">
      <input
        className="theme-container-toggle"
        type="checkbox"
        id="switch"
        name="mode"
        onChange={() => {
          setIsDarkMode(!isDarkMode);
        }}
        checked={isDarkMode}
      />
      <label className="theme-label" htmlFor="switch"></label>
    </div>
  );
};
export default ThemeButton;
