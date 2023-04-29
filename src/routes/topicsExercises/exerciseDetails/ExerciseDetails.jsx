import { useContext, useEffect, useRef, useState } from "react";
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
  const [js, setJs] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewCss, setPreviewCss] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviewHtml(html);
    }, 1000);
    return () => clearTimeout(timer);
  }, [html]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviewCss(css);
    }, 1000);
    return () => clearTimeout(timer);
  }, [css]);
  let topicExercises = [];
  let exercise = null;
  let exerciseTopic = null;
  let parsedCode = false;
  if (exercises) {
    topicExercises = exercises.filter(
      (exercise) => exercise.topic.name === topic
    );
    exercise = topicExercises[exerciseNum];
  }
  if (exercise?.code) {
    let splittedCode = exercise.code.split("-");
    let semiParsedCode = splittedCode.map((code) => {
      return code + "\n";
    });
    parsedCode = semiParsedCode.join("");
  }
  const containerRef = useRef(null);
  const resizerRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleMouseUp = () => {
    if (isResizing) {
      setIsResizing(false);
    }
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newEditorHeight = e.clientY - containerRect.top;
    resizerRef.current.style.top = newEditorHeight + "px";
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="exercise-details-container">
      {exercise === null ? (
        "loading"
      ) : language === "javascript" ? (
        <>
          <span>{exerciseTopic?.description}</span>
          <p>{exercise?.question}</p>
          {parsedCode && (
            <CodeEditor
              code={parsedCode}
              answers={exercise?.answers}
              language={language}
              onChange={(newValue) => setJs(newValue)}
            />
          )}
        </>
      ) : (
        <div
          className="html-css-editor-container editor-container"
          ref={containerRef}
        >
          <div className="html-css-editor">
            <CodeEditor
              language="html"
              code={html}
              answers={exercise?.answers}
              onChange={(newValue) => setHtml(newValue)}
            />
            <div
              className="resizer"
              ref={resizerRef}
              onMouseDown={handleMouseDown}
            ></div>{" "}
            <CodeEditor
              language="css"
              code={css}
              answers={exercise?.answers}
              onChange={(newValue) => setCss(newValue)}
            />
          </div>
          <div className="preview-container">
            <PreviewPane html={previewHtml} css={previewCss} />
          </div>
        </div>
      )}
    </div>
  );
};
export default ExerciseDetails;
