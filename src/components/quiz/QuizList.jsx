import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import GlobalContext from "../../contexts/Global-Context";

const QuizList = () => {
  const navigate = useNavigate();
  const { user } = useContext(GlobalContext);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/quizzes`
      );
      const sortedQuizzes = response.data.data.data.sort(
        (a, b) => a.position - b.position
      );
      setQuizzes(sortedQuizzes);
    })();
  }, []);

  const handleClick = async (id) => {
    /*     const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/payments?user=${
        user._id
      }&quiz=${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.data.data.data.length === 0) return navigate(`/payment/${id}`); */
    navigate(`/quizzes/${id}`);
  };
  return (
    <div className="add-exercise-step">
      <h1 className="pt-5 blog-title">
        Choose a language to embark on quiz adventures:
      </h1>
      <div className="add-exercise-languages">
        {quizzes.map((quiz) => (
          <span
            key={quiz._id}
            className={`add-exercise-language`}
            onClick={() => handleClick(quiz._id)}
          >
            {quiz.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default QuizList;
