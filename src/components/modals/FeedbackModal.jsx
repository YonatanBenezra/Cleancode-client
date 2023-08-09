import PropTypes from "prop-types";

const FeedbackModal = ({ submittedAnswer }) => {
  const { isCorrect, score, hints, badPractices, bestPractices, tips } =
    submittedAnswer;

  return (
    <div className="modal" id="feedbackModal" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Modal title</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
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
          <div className="modal-footer">
            <button type="button" className="modal-btn">
              Next Exercise
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

FeedbackModal.propTypes = {
  submittedAnswer: PropTypes.shape({
    isCorrect: PropTypes.bool,
    score: PropTypes.number,
    hints: PropTypes.string,
    badPractices: PropTypes.string,
    bestPractices: PropTypes.string,
    tips: PropTypes.string,
  }),
};

export default FeedbackModal;
