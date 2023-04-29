import { useContext, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import GlobalContext from "../../../contexts/Global-Context";
import "./topic-exercises.scss";
const TopicExercises = () => {
  const { topic } = useParams();
  const { exercises } = useContext(GlobalContext);
  let topicExercises = [];
  if (exercises) {
    topicExercises = exercises.filter((exercise) =>
      exercise.topic.name === topic
    );
  }

  return (
    <div className="topic-exercises">
      {topicExercises.map((exercise, index) => (
        <span className="topic-exercise-container" key={index}>
          <NavLink
            to={`${index}`}
            className="topic-exercise"
            key={exercise.path}
          >
            {index + 1}.<span>{exercise.name}</span>
          </NavLink>

          <span
            className={
              window.innerWidth > 1000
                ? "topic-description"
                : "topic-description-mobile"
            }
          >
            {exercise.description}
          </span>

          {index !== topicExercises.length - 1 && (
            <div className="topic-line"></div>
          )}
        </span>
      ))}
    </div>
  );
};

export default TopicExercises;
