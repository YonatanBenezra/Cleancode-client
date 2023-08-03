import { createContext, useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const GlobalContext = createContext();

const fetchData = async (url) => {
  const response = await axios.get(url);
  return response.data.data.data;
};

export const GlobalProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? JSON.parse(storedTheme) : true;
  });

  const [isCollapsed, setIsCollapsed] = useState(() => {
    const storedCollapse = localStorage.getItem("collapse");
    return storedCollapse ? JSON.parse(storedCollapse) : false;
  });
  const [exercises, setExercises] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [topics, setTopics] = useState([]);
  const [user, setUser] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataAndSetState = async (url, setter) => {
      try {
        const data = await fetchData(url);
        setter(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchDataAndSetState(
      `${import.meta.env.VITE_API_URL}/api/topics/`,
      setTopics
    );
    fetchDataAndSetState(`${import.meta.env.VITE_API_URL}/api/users/`, setUser);
    fetchDataAndSetState(
      `${import.meta.env.VITE_API_URL}/api/exercises/`,
      setExercises
    );
    fetchDataAndSetState(
      `${import.meta.env.VITE_API_URL}/api/languages/`,
      setLanguages
    );

    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) setIsDarkMode(JSON.parse(storedTheme));

    const storedCollapse = localStorage.getItem("collapse");
    if (storedCollapse) setIsCollapsed(JSON.parse(storedCollapse));
  }, []);

  useEffect(() => {
    const mode = isDarkMode ? "dark" : null;
    const collapse = isCollapsed ? "collapsed" : null;

    document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem("theme", isDarkMode);

    document.documentElement.setAttribute("data-collapse", collapse);
    localStorage.setItem("collapse", isCollapsed);
  }, [isDarkMode, isCollapsed]);

  return (
    <GlobalContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode,
        isCollapsed,
        setIsCollapsed,
        topics,
        setTopics,
        exercises,
        setExercises,
        languages,
        setLanguages,
        setUser,
        user,
        error,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

GlobalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default GlobalContext;
