import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import GlobalContext from "../../../contexts/Global-Context";
import "./exercise-details.scss";
import CodeEditor from "../../../components/codeEditor/CodeEditor";
import PreviewPane from "../../../components/previewPane/PreviewPane";

const ExerciseDetails = () => {
  const { language, topic, exerciseNum } = useParams();
  const { exercises } = useContext(GlobalContext);
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [previewCode, setPreviewCode] = useState({ html: "", css: "" });

  const { exercise, parsedCode } = useMemo(() => {
    let topicExercises = [];
    let exercise = null;
    let parsedCode = false;

    if (exercises) {
      topicExercises = exercises.filter(
        (exercise) => exercise.topic.name === topic
      );
      topicExercises.sort((a, b) => (a.position > b.position ? 1 : -1));
      exercise = topicExercises[exerciseNum];
    }

    if (exercise?.code) {
      let splittedCode = exercise.code.split("-");
      let semiParsedCode = splittedCode.map((code) => code + "\n");
      parsedCode = semiParsedCode.join("");
    }

    return { topicExercises, exercise, parsedCode };
  }, [exercises, topic, exerciseNum]);

  const containerRef = useRef(null);
  const resizerRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = useCallback(() => setIsResizing(true), []);
  const handleMouseUp = useCallback(
    () => isResizing && setIsResizing(false),
    [isResizing]
  );
  const handleMouseMove = useCallback(
    (e) => {
      if (!isResizing) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newEditorHeight = e.clientY - containerRect.top;
      resizerRef.current.style.top = newEditorHeight + "px";
    },
    [isResizing]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviewCode({ html, css });
    }, 1000);
    return () => clearTimeout(timer);
  }, [html, css]);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  if (!exercises) {
    return <div>Loading...</div>;
  }

  if (exercises.length === 0) {
    return <div>No exercises found</div>;
  }

  return (
    <div className="exercise-details-container">
      {exercise ? (
        <React.Fragment>
          <span>{exercise.topic?.description}</span>
          <p>{exercise?.question}</p>
          <CodeEditor
            code={parsedCode}
            answers={exercise?.answers}
            selectedLanguage={language}
            onChange={(newValue) =>
              language === "javascript" ? setHtml(newValue) : setCss(newValue)
            }
          />
          {language !== "javascript" && (
            <div
              className="html-css-editor-container editor-container"
              ref={containerRef}
            >
              <div className="html-css-editor">
                <div
                  className="resizer"
                  ref={resizerRef}
                  onMouseDown={handleMouseDown}
                ></div>
                <PreviewPane html={previewCode.html} css={previewCode.css} />
              </div>
            </div>
          )}
        </React.Fragment>
      ) : (
        "Loading..."
      )}
    </div>
  );
};
export default ExerciseDetails;
