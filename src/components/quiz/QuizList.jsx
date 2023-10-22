import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/quizzes`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const sortedQuizzes = response.data.data.data.sort(
        (a, b) => a.position - b.position
      );
      setQuizzes(sortedQuizzes);
    })();
  }, []);

  return (
    <div className="add-exercise-step">
      <h1 className="pt-5 blog-title">
        Choose a language to embark on quiz adventures:
      </h1>
      <div className="add-exercise-languages">
        {quizzes.map((quiz) => (
          <Link key={quiz._id} to={`/quizzes/${quiz._id}`}>
            <span className={`add-exercise-language`}>{quiz.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuizList;
