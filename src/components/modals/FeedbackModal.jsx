import PropTypes from "prop-types";

const FeedbackModal = ({ submittedAnswer, title, setShowConfetti }) => {
  const { isCorrect, score, hints, badPractices, bestPractices, tips } =
    submittedAnswer;

  return (
    <div className="modal" id="feedbackModal" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" style={{ textTransform: "capitalize" }}>
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => setShowConfetti(false)}
            ></button>
          </div>
          <div className="modal-body">
            <p>
              Your answer was{" "}
              <span className="span">{isCorrect ? "Correct" : "Wrong"}</span>.
            </p>
            {score !== undefined && (
              <p>
                Its score is: <span className="span">{score}</span>
              </p>
            )}
            {hints && (
              <p>
                <span className="span">Hints</span>: {hints}
              </p>
            )}
            {badPractices && (
              <p>
                <span className="span">Bad Practices</span>: {badPractices}
              </p>
            )}
            {bestPractices && (
              <p>
                <span className="span">Best Practices</span>: {bestPractices}
              </p>
            )}
            {tips && (
              <p>
                <span className="span">Tips</span>: {tips}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

FeedbackModal.propTypes = {
  title: PropTypes.string,
  submittedAnswer: PropTypes.shape({
    isCorrect: PropTypes.bool,
    score: PropTypes.number,
    hints: PropTypes.string,
    badPractices: PropTypes.string,
    bestPractices: PropTypes.string,
    tips: PropTypes.string,
  }),
  setShowConfetti: PropTypes.func,
};

export default FeedbackModal;
