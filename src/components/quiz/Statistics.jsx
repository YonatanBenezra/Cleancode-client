import PropTypes from "prop-types";
import Certificate from "./Certificate";
import { useContext } from "react";
import GlobalContext from "../../contexts/Global-Context";
import { PDFDownloadLink } from "@react-pdf/renderer";

function Statistics({ score, totalQuestions, questions, userAnswers }) {
  const { user } = useContext(GlobalContext);

  const findUserAnswer = (questionId) =>
    userAnswers.find((answer) => answer._id === questionId);

  return (
    <div className="text-center">
      <h2>Quiz Completed!</h2>
      <p className="display-5 text-warning mt-4">
        Your Score: {score}/{totalQuestions}
      </p>
      <button className="btn">
        <PDFDownloadLink
          document={
            <Certificate
              username={user.name}
              score={(score / totalQuestions) * 100}
            />
          }
          fileName="certificate.pdf"
        >
          {({ loading }) =>
            loading ? "Loading document..." : "Download Certificate!"
          }
        </PDFDownloadLink>
      </button>
      <div className="mt-4">
        <h4 className="mb-3">Review:</h4>
        <ul className="list-group">
          {questions.map((question, index) => {
            const userAnswerObj = findUserAnswer(question._id);
            return (
              <li key={index} className="list-group-item">
                <strong>{question.question}</strong>
                <span className="badge badge-pill bg-warning ms-2">
                  {question.marks} {question.marks > 1 ? "marks" : "mark"}
                </span>

                <p className="text-muted mt-3">
                  Your Answer: {userAnswerObj.answer}
                  {userAnswerObj.isCorrect ? (
                    <span className="text-success ml-2">✅</span>
                  ) : (
                    <span className="text-danger ml-2">❌</span>
                  )}
                </p>

                {!userAnswerObj.isCorrect && (
                  <p>
                    <span className="text-success">Correct Answer: </span>
                    {question.correctAnswer}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

Statistics.propTypes = {
  score: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  questions: PropTypes.array.isRequired,
  userAnswers: PropTypes.array.isRequired,
};

export default Statistics;
