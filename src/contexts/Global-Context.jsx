import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/topics/")
      .then((res) => {
        setTopics(res.data.data.data);
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:8000/api/exercises/")
      .then((res) => {
        setExercises(res.data.data.data);
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:8000/api/languages/")
      .then((res) => {
        setLanguages(res.data.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setIsDarkMode(JSON.parse(storedTheme));
    }
    const storedCollapse = localStorage.getItem("collapse");
    if (storedCollapse) {
      setIsCollapsed(JSON.parse(storedCollapse));
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("theme", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    if (isCollapsed) {
      document.documentElement.setAttribute("data-collapse", "collapsed");
    } else {
      document.documentElement.removeAttribute("data-collapse");
    }
    localStorage.setItem("collapse", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

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
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
