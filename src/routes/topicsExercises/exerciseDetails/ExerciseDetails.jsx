// Library imports
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useReducer,
} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// Local imports
import GlobalContext from "../../../contexts/Global-Context";
import CodeEditor from "../../../components/codeEditor/CodeEditor";
import PreviewPane from "../../../components/previewPane/PreviewPane";

// Stylesheet
import "./exercise-details.scss";

// Custom hooks
const useExercise = (exercises, topic, exerciseNum) => {
  let topicExercises = [];
  let exercise = null;

  if (exercises) {
    topicExercises = exercises.filter(
      (exercise) => exercise.topic.name === topic
    );
    topicExercises.sort((a, b) => (a.position > b.position ? 1 : -1));
    exercise = topicExercises[exerciseNum];
  }

  let parsedCode = exercise?.code
    ? exercise.code
        .split("-")
        .map((code) => code + "\n")
        .join("")
    : null;

  return { exercise, parsedCode };
};

const useResizer = (containerRef, resizerRef) => {
  const [isResizing, setIsResizing] = useState(false);
  const [topEditorHeight, setTopEditorHeight] = useState("50vh");
  const [bottomEditorHeight, setBottomEditorHeight] = useState("50vh");

  const handleMouseDown = () => setIsResizing(true);
  const handleMouseUp = useCallback(() => setIsResizing(false), []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isResizing) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newHeightTop = e.clientY - containerRect.top;
      const newHeightBottom = containerRect.bottom - e.clientY;
      resizerRef.current.style.top = `${newHeightTop}px`;
      setTopEditorHeight(`${newHeightTop}px`);
      setBottomEditorHeight(`${newHeightBottom}px`);
    },
    [isResizing, containerRef, resizerRef]
  );

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return { handleMouseDown, topEditorHeight, bottomEditorHeight }; // return both heights
};

// Main Component
const ExerciseDetails = () => {
  const { language, topic, exerciseNum } = useParams();
  const { exercises } = useContext(GlobalContext);
  const [showImage, setShowImage] = useState(false);

  const { exercise, parsedCode } = useExercise(exercises, topic, exerciseNum);
  const containerRef = useRef(null);
  const resizerRef = useRef(null);
  const { handleMouseDown, topEditorHeight, bottomEditorHeight } = useResizer(
    containerRef,
    resizerRef
  );
  const [loading, setLoading] = useState(false);
  const [submittedAnswer, setSubmittedAnswer] = useState({});

  const [state, setState] = useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    { html: "", css: "", js: "", previewHtml: "", previewCss: "" }
  );

  // Function declarations
  const handlePreviewUpdate = useCallback((type, value) => {
    const timer = setTimeout(() => {
      setState({ [`preview${type}`]: value });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(
    () => handlePreviewUpdate("Html", state.html),
    [state.html, handlePreviewUpdate]
  );
  useEffect(
    () => handlePreviewUpdate("Css", state.css),
    [state.css, handlePreviewUpdate]
  );

  function parseInput(input) {
    const lines = input.split("\n");
    const questionLines = [];
    const codeLines = [];

    for (const line of lines) {
      if (line.trim().startsWith("//")) {
        const questionLine = line.replace("//", "").trim();
        questionLines.push(questionLine);
      } else {
        codeLines.push(line);
      }
    }

    const question = questionLines.join("\n");
    const code = codeLines.join("\n");

    return { question, code };
  }

  const handleSubmitValue = async () => {
    if (
      !parseInput(state.js).code.trim() &&
      !state.html.trim() &&
      !state.css.trim()
    )
      return setSubmittedAnswer({ isCorrect: false, score: 0 });
    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo-16k",
          messages: [
            {
              role: "user",
              content: `Ensure you adopt the following structure to assess and provide feedback on the user's response:

              {
              isCorrect: Boolean,
              hints: String,
              badPractices: String,
              bestPractices: String,
              tips: String,
              score: Number
              }.
              
              The score should express how closely the user's response aligns with the desired answer, represented on a scale from 0 to 100. Additionally, consider providing hints that guide the user towards the correct answer, outline any bad practices they may have employed, and propose best practices they should adhere to. Supply tips aimed at improving their overall coding skills. It's critical not to reveal the correct answer within the feedback.

              Question: ${parseInput(state.js).question}.
              Code: 
              HTML:\n${state.html}\n
              CSS:\n${state.css}\n
              JS:\n${parseInput(state.js).code}.`,
            },
          ],
          max_tokens: 200,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_APP_GPT_KEY}`,
          },
        }
      );

      const result = Function(
        `"use strict"; return (${response.data.choices[0].message.content});`
      )();
      setSubmittedAnswer(result);
    } catch (error) {
      alert("Please try after 30 seconds");
    } finally {
      setLoading(false);
    }
  };

  // Render JSX
  return (
    <div className="exercise-details-container">
      {exercise === null ? (
        "loading"
      ) : language === "javascript" ? (
        <React.Fragment>
          <span>{exercise?.description}</span>
          <p>{exercise?.question}</p>
          {parsedCode && (
            <CodeEditor
              code={parsedCode}
              answers={exercise?.answers}
              selectedLanguage={language}
              onChange={(newValue) => setState({ js: newValue })}
            />
          )}
          <div
            className={`output-window ${
              submittedAnswer.isCorrect !== undefined
                ? submittedAnswer.isCorrect
                  ? "success"
                  : "error"
                : ""
            }`}
          >
            <div className="btn-msg-container">
              <button
                onClick={handleSubmitValue}
                className="code-editor-submit-button"
                disabled={loading}
              >
                {loading ? "Loading..." : "Run"}
              </button>
              {submittedAnswer.isCorrect !== undefined && (
                <span className="output-message">
                  {submittedAnswer.isCorrect
                    ? "Amazing, great job"
                    : submittedAnswer.feedback}
                </span>
              )}
            </div>
            <h3>Output / Console</h3>
            <hr className="horizontal-line" />
            <div className="output-window__content">
              {submittedAnswer && submittedAnswer.isCorrect !== undefined && (
                <div>
                  <p>
                    Your answer was{" "}
                    <code>
                      {submittedAnswer.isCorrect ? "Correct" : "Wrong"}
                    </code>
                    . Its score is: {submittedAnswer.score}
                  </p>
                  {submittedAnswer.hints && (
                    <p>Hints: {submittedAnswer.hints}</p>
                  )}
                  {submittedAnswer.badPractices && (
                    <p>Bad Practices: {submittedAnswer.badPractices}</p>
                  )}
                  {submittedAnswer.bestPractices && (
                    <p>Best Practices: {submittedAnswer.bestPractices}</p>
                  )}
                  {submittedAnswer.tips && <p>Tips: {submittedAnswer.tips}</p>}
                </div>
              )}
            </div>
            <a href={`/javascript/${topic}/${Number() + 1}`}>Next Exercise</a>
          </div>
        </React.Fragment>
      ) : (
        <div
          className="html-css-editor-container editor-container"
          ref={containerRef}
        >
          <div className="html-css-editor">
            <div style={{ textAlign: "center" }}>
              <h3>{exercise?.description}</h3>
              <p>{parsedCode}</p>
              <button
                onClick={() => setShowImage((prev) => !prev)}
                className="next-link"
              >
                {showImage ? "Show Code" : "Show Image"}
              </button>
            </div>
            {showImage ? (
              <div className="app-container">
                <img
                  src="https://i.ibb.co/9crLtc0/Screenshot-3.png"
                  alt="code"
                />
              </div>
            ) : (
              <>
              <h2 className="panel-label">HTML</h2>
                <CodeEditor
                  selectedLanguage="html"
                  code={state.html}
                  answers={exercise?.answers}
                  onChange={(newValue) => setState({ html: newValue })}
                  height={topEditorHeight}
                />

                <div
                  className="resizer"
                  ref={resizerRef}
                  onMouseDown={handleMouseDown}
                ></div>
<h2 className="panel-label">CSS</h2>
                <CodeEditor
                  selectedLanguage="css"
                  code={state.css}
                  answers={exercise?.answers}
                  onChange={(newValue) => setState({ css: newValue })}
                  height={bottomEditorHeight}
                />
              </>
            )}
          </div>
          <div className="preview-container">
            <PreviewPane html={state.previewHtml} css={state.previewCss} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseDetails;
