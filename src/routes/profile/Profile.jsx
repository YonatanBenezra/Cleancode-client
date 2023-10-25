import { useContext } from "react";
import "./profile.scss";
import GlobalContext from "../../contexts/Global-Context";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, exercises } = useContext(GlobalContext);

  const totalExercises = exercises.length;
  const completedExercises = user.finishedExercises?.length;
  const completedPercentage = (
    (completedExercises / totalExercises) *
    100
  ).toFixed(2);

  const exercisesPerTopic =
    user.finishedExercises?.reduce((acc, cur) => {
      const topicName = cur.topic.name;
      if (!acc[topicName]) {
        acc[topicName] = 0;
      }
      acc[topicName]++;
      return acc;
    }, {}) || {};
  return (
    <div className="text-center my-5 user-profile">
      <h1 className="page-title">{user.name}'s Profile</h1>
      <div className="topics-container d-flex flex-wrap flex-row justify-content-center align-items-center gap-3">
        <span className="topics-topic">
          <span className="exercise">
            <div>
              <p className="number">{totalExercises}</p>
              <p className="text"> Total Exercises</p>
            </div>
          </span>
        </span>

        <span className="topics-topic">
          <span className="exercise">
            <div>
              <p className="number">{completedExercises}</p>
              <p className="text"> Exercises Completed</p>
            </div>
          </span>
        </span>
        <span className="topics-topic">
          <span className="exercise">
            <div>
              <p className="number">{completedPercentage}%</p>
              <p className="text"> Completion Percentage</p>
            </div>
          </span>
        </span>
      </div>
      <div className="mt-3">
        <h3>Number of exercises finished per topic:</h3>
        {Object.entries(exercisesPerTopic).map(([topic, count]) => (
          <p key={topic}>
            {topic}: {count}
          </p>
        ))}
      </div>
      <Link to="/get-started" className="hero-button mx-auto my-4">
        Practice More
      </Link>
      <div id="container-f1a05f63016536eb9941bcfe94f17bae"></div>
    </div>
  );
};

export default Profile;
