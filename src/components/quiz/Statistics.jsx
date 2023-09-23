import PropTypes from "prop-types";
import Certificate from "./Certificate";
import { useContext } from "react";
import GlobalContext from "../../contexts/Global-Context";
import { PDFDownloadLink } from "@react-pdf/renderer";

function Statistics({ score, totalQuestions, questions, userAnswers }) {
  const { user } = useContext(GlobalContext);
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
            const isAnswerCorrect =
              userAnswers[index] === question.correctAnswer;
            return (
              <li key={index} className="list-group-item">
                <strong>{question.question}</strong>
                <span className="float-right badge badge-pill badge-primary">
                  {question.marks} {question.marks > 1 ? "marks" : "mark"}
                </span>
                <br />
                <span className="text-muted">Your Answer:</span>
                {userAnswers[index]}
                {isAnswerCorrect ? (
                  <span className="text-success ml-2">✅</span>
                ) : (
                  <span className="text-danger ml-2">❌</span>
                )}
                <br />
                {!isAnswerCorrect && (
                  <>
                    <span className="text-success">Correct Answer:</span>{" "}
                    {question.correctAnswer}
                  </>
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
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      correctAnswer: PropTypes.string.isRequired,
    })
  ).isRequired,
  userAnswers: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

export default Statistics;
