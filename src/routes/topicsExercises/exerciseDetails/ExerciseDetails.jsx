import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useReducer,
} from "react";
import { useParams } from "react-router-dom";
import GlobalContext from "../../../contexts/Global-Context";
import "./exercise-details.scss";
import CodeEditor from "../../../components/codeEditor/CodeEditor";
import PreviewPane from "../../../components/previewPane/PreviewPane";

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

  const [state, setState] = useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    { html: "", css: "", js: "", previewHtml: "", previewCss: "" }
  );

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
