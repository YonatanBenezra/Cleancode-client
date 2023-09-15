import PropTypes from "prop-types";

function Question({ question, options, selectedAnswer, handleOptionClick }) {
  return (
    <div>
      <h2 className="mb-3">{question}</h2>

      {options.map((option, index) => (
        <label
          key={index}
          className={`form-check question-option alert alert-${
            selectedAnswer === option ? "primary" : "secondary"
          }`}
          htmlFor={`option${index}`}
        >
          <input
            className="form-check-input"
            type="radio"
            name="option"
            id={`option${index}`}
            value={option}
            checked={selectedAnswer === option}
            onChange={() => handleOptionClick(option)}
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}

Question.propTypes = {
  question: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedAnswer: PropTypes.string,
  handleOptionClick: PropTypes.func.isRequired,
};

export default Question;
