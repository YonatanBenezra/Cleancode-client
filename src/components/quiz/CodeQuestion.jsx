import PropTypes from "prop-types";
import CodeEditor from "../codeEditor/CodeEditor";

function CodeQuestion({ question, initialCode, onCodeChange }) {
  return (
    <div>
      <h2 className="mb-3">{question}</h2>
      <CodeEditor
        selectedLanguage="javascript"
        code={initialCode}
        onChange={onCodeChange}
      />
    </div>
  );
}

CodeQuestion.propTypes = {
  question: PropTypes.string.isRequired,
  initialCode: PropTypes.string.isRequired,
  onCodeChange: PropTypes.func.isRequired,
};

export default CodeQuestion;
