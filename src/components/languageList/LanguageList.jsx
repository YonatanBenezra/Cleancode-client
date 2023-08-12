import { useContext, useEffect, useState } from "react";
import GlobalContext from "../../contexts/Global-Context";
import PropTypes from "prop-types";
import "./language-list.scss";

const LanguageList = ({ handleNext }) => {
  const { languages } = useContext(GlobalContext);

  const [sortedLanguages, setSortedLanguages] = useState([]);
  useEffect(() => {
    if (languages) {
      setSortedLanguages(languages.sort((a, b) => a.position - b.position));
    }
  }, [languages]);
  return (
    <div className="add-exercise-step">
      <h1 className="pt-5 blog-title">Select a language:</h1>
      <div className="add-exercise-languages">
        {sortedLanguages.map((language, index) => (
          <span
            key={index}
            className={`add-exercise-language`}
            onClick={() => handleNext(language._id)}
          >
            {language.name}
          </span>
        ))}
      </div>
    </div>
  );
};

LanguageList.propTypes = {
  handleNext: PropTypes.func.isRequired,
};
export default LanguageList;
