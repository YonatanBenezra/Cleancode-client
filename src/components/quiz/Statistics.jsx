import PropTypes from "prop-types";
import { useMemo } from "react";
/* import { PDFDownloadLink } from "@react-pdf/renderer";
import GlobalContext from "../../contexts/Global-Context";
import Certificate from "./Certificate"; */

function Statistics({ score, questions, userAnswers }) {
  /*  const { user } = useContext(GlobalContext); */

  const findUserAnswer = (questionId) =>
    userAnswers.find((answer) => answer._id === questionId);

  const totalScore = useMemo(
    () => questions.reduce((total, obj) => total + obj.marks, 0),
    [questions]
  );

  return (
    <div className="text-center">
      <h2>Quiz Completed!</h2>
      <p>
        Thanks for participating! We will review your performance and notify you
        by email within three days regarding the certificate.
      </p>
      <p className="display-5 text-warning mt-4">
        Your Score: {score}/{totalScore}
      </p>
      {/* <button className="btn">
        <PDFDownloadLink
          document={
            <Certificate
              username={user.name}
              score={(score / totalScore) * 100}
            />
          }
          fileName="certificate.pdf"
        >
          {({ loading }) =>
            loading ? "Loading document..." : "Download Certificate!"
          }
        </PDFDownloadLink>
      </button> */}
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
  questions: PropTypes.array.isRequired,
  userAnswers: PropTypes.array.isRequired,
};

export default Statistics;
