import { NavLink, useParams } from "react-router-dom";
import "./topics.scss";
import GlobalContext from "../../../contexts/Global-Context";
import { useContext } from "react";

const Topics = () => {
  const { topics } = useContext(GlobalContext);
  const {language} = useParams();
  let sortedTopics = [];
  if (topics) {
    sortedTopics = topics.filter((topic) => topic.language.name === language);
    sortedTopics.sort((a, b) => a.position - b.position);
  }
  return (
    <div className="topics-container">
      {sortedTopics.map((topic, index) => (
        <span key={index} className="topics-topic">
          <NavLink to={topic.name} className="exercise" key={topic.language}>
            {index + 1}.<span>{topic.name}</span>
          </NavLink>
          {index !== sortedTopics.length - 1 && <div className="line"></div>}
        </span>
      ))}
    </div>
  );
};

export default Topics;
