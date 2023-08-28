import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useReducer,
} from "react";
import Confetti from "react-confetti";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import GlobalContext from "../../../contexts/Global-Context";
import CodeEditor from "../../../components/codeEditor/CodeEditor";
import PreviewPane from "../../../components/previewPane/PreviewPane";
import "./exercise-details.scss";
import FeedbackModal from "../../../components/modals/FeedbackModal";

const ExerciseDetails = () => {
  const { language, topic, exerciseNum } = useParams();
  const { exercises, setUser, user } = useContext(GlobalContext);
  const [remainingTime, setRemainingTime] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedAnswer, setSubmittedAnswer] = useState({});
  const containerRef = useRef(null);
  const resizerRef = useRef(null);
  const MIN_EDITOR_WIDTH = -90;

  const [state, setState] = useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    { html: "", css: "", js: "", previewHtml: "", previewCss: "" }
  );

  // Custom hook
  const useExercise = (exercises, topic, exerciseNum) => {
    let topicExercises = [];
    let exercise = null;

    if (exercises) {
      topicExercises = exercises.filter(
        (exercise) =>
          exercise.topic.name === topic &&
          exercise.topic.language.name === language &&
          exercise.approved
      );
      topicExercises.sort((a, b) => (a.position > b.position ? 1 : -1));
      exercise = topicExercises[exerciseNum];
    }

    return exercise;
  };
  const exercise = useExercise(exercises, topic, exerciseNum);
  // Editor resizer
  const useResizer = (containerRef) => {
    const [isResizing, setIsResizing] = useState(false);
    const [leftEditorWidth, setLeftEditorWidth] = useState("0");
    const [rightEditorWidth, setRightEditorWidth] = useState("0");

    const RESIZE_OFFSET = 135; // or any other appropriate name and value

    const handleMouseDown = () => setIsResizing(true);

    const handleMouseUp = useCallback(() => setIsResizing(false), []);

    const handleMouseMove = useCallback(
      (e) => {
        if (!isResizing) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const newWidthLeft = e.clientX - containerRect.left - RESIZE_OFFSET;
        const newWidthRight = containerRect.right - e.clientX - RESIZE_OFFSET;

        if (newWidthLeft < MIN_EDITOR_WIDTH || newWidthRight < MIN_EDITOR_WIDTH)
          return;

        setLeftEditorWidth(`${newWidthLeft}px`);
        setRightEditorWidth(`${newWidthRight}px`);
      },
      [isResizing, containerRef]
    );

    useEffect(() => {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [handleMouseMove, handleMouseUp]);

    const reset = useCallback(() => {
      setLeftEditorWidth("0");
      setRightEditorWidth(0);
    }, []);
    return { handleMouseDown, leftEditorWidth, rightEditorWidth, reset };
  };

  const { handleMouseDown, leftEditorWidth, rightEditorWidth, reset } =
    useResizer(containerRef);
  // Helper function to parse input
  const parseInput = (input) => {
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

    const question = questionLines.join(" ");
    const code = codeLines.join("");

    return { question, code };
  };

  // Handle update of preview
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

  // Handle form submission
  const handleSubmitValue = async () => {
    setRemainingTime(20);
    const countdown = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    const modal = new window.bootstrap.Modal(
      document.getElementById("feedbackModal"),
      {}
    );
    let content = `Ensure you adopt the following structure to assess and provide feedback on the user's response:
      {
        isCorrect: Boolean,
        hints: String,
        badPractices: String,
        bestPractices: String,
        tips: String,
        score: Number
      }.
      The score should express how closely the user's response aligns with the desired answer, represented on a scale from 0 to 100. Additionally, consider providing hints that guide the user towards the correct answer, outline any bad practices they may have employed, and propose best practices they should adhere to. Supply tips aimed at improving their overall coding skills. It's critical not to reveal the correct answer within the feedback.`;

    if (language === "javascript" || language === "python") {
      content += `\nQuestion: ${exercise?.description}.\n${
        language[0].toUpperCase() + language.slice(1)
      }: ${parseInput(state.js).code}.`;
    } else {
      content += `\nQuestion: ${exercise?.description}.\nHTML: ${state.html}\nCSS: ${state.css}\n`;
    }

    if (
      !(
        parseInput(state.js)?.code?.trim() ||
        state.html.trim() ||
        state.css.trim()
      )
    ) {
      setSubmittedAnswer({ isCorrect: false, score: 0 });
      return modal.show();
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo-16k",
          messages: [
            {
              role: "user",
              content: content,
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
      if (result.isCorrect && user._id) {
        const res = await axios.patch(
          `${import.meta.env.VITE_API_URL}/api/users/updateMe`,
          {
            finishedExercise: exercise._id,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUser(res.data.data.user);
      }
      if (result.isCorrect) setShowConfetti(true);

      setSubmittedAnswer(result);

      modal.show();
    } catch (error) {
      alert("Please try after 20 seconds");
    } finally {
      setLoading(false);
    }
  };
  const [collapsedHtmlEditor, setCollapsedHtmlEditor] = useState(false);
  const [collapsedCssEditor, setCollapsedCssEditor] = useState(false);
  // Render JSX
  return (
    <div className="exercise-details-container">
      {exercise ? (
        <div className="editors-container" ref={containerRef}>
          {language === "javascript" || language === "python" ? (
            <div className="editor js-editor">
              <h2 className="panel-label">{exercise?.name}</h2>

              <div className="description">
                <p className="m-0">{exercise?.description}</p>
              </div>
              <CodeEditor
                code={state.js}
                answers={exercise?.answers}
                selectedLanguage={language}
                onChange={(newValue) => setState({ js: newValue })}
              />
              <Buttons
                handleSubmitValue={handleSubmitValue}
                loading={loading}
                remainingTime={remainingTime}
                text="Run Code"
              />
            </div>
          ) : (
            <React.Fragment>
              <h2 className="panel-label mt-3">{exercise?.name}</h2>
              <div className="description mx-auto">
                <p className="m-0">{exercise?.description}</p>
              </div>
              <Buttons
                handleSubmitValue={handleSubmitValue}
                loading={loading}
                remainingTime={remainingTime}
                text="Show Feedback"
              />
              <div className="d-flex justify-content-center align-items-center gap-3 mb-5">
                <button
                  className="btn maximize-minimize-btn"
                  onClick={() => {
                    if (!collapsedHtmlEditor) {
                      setCollapsedHtmlEditor(true);
                      setCollapsedCssEditor(false);
                      reset();
                    } else {
                      setCollapsedHtmlEditor(!collapsedHtmlEditor);
                    }
                  }}
                >
                  {collapsedHtmlEditor ? (
                    <span className="d-flex justify-content-center align-items-center gap-2">
                      <i
                        className="fa-brands fa-html5"
                        style={{ color: "#f06529" }}
                      ></i>{" "}
                      <i className="fa-solid fa-maximize"></i>
                    </span>
                  ) : (
                    <span className="d-flex justify-content-center align-items-center gap-2">
                      <i
                        className="fa-brands fa-html5"
                        style={{ color: "#f06529" }}
                      ></i>{" "}
                      <i className="fa-solid fa-minimize"></i>
                    </span>
                  )}
                </button>
                <button
                  className="btn"
                  onClick={() => setShowImage((prev) => !prev)}
                >
                  Show Demo Image
                </button>
                <button
                  className="btn maximize-minimize-btn"
                  onClick={() => {
                    if (!collapsedCssEditor) {
                      setCollapsedCssEditor(true);
                      setCollapsedHtmlEditor(false);
                      reset();
                    } else {
                      setCollapsedCssEditor(!collapsedCssEditor);
                    }
                  }}
                >
                  {collapsedCssEditor ? (
                    <span className="d-flex justify-content-center align-items-center gap-2">
                      <i
                        className="fa-brands fa-css3-alt"
                        style={{ color: "#2965f1" }}
                      ></i>{" "}
                      <i className="fa-solid fa-maximize"></i>
                    </span>
                  ) : (
                    <span className="d-flex justify-content-center align-items-center gap-2">
                      <i
                        className="fa-brands fa-css3-alt"
                        style={{ color: "#2965f1" }}
                      ></i>{" "}
                      <i className="fa-solid fa-minimize"></i>
                    </span>
                  )}
                </button>
              </div>
              {showImage ? (
                <img
                  src={exercise.imgUrl}
                  className="demo-img"
                  alt="Demo for Exercise"
                />
              ) : (
                <div className="html-css-editors-container">
                  <div
                    className={`editor html-css-editor ${
                      collapsedHtmlEditor ? "minimized" : ""
                    }`}
                    style={{
                      width: `${collapsedCssEditor ? "100%" : leftEditorWidth}`,
                    }}
                  >
                    <h2 className="panel-label">HTML</h2>
                    <CodeEditor
                      selectedLanguage="html"
                      code={state.html}
                      answers={exercise?.answers}
                      onChange={(newValue) => setState({ html: newValue })}
                      width="100%"
                    />
                  </div>
                  {!collapsedHtmlEditor && !collapsedCssEditor && (
                    <div
                      className="resizer"
                      ref={resizerRef}
                      onMouseDown={handleMouseDown}
                    ></div>
                  )}

                  <div
                    className={`editor html-css-editor ${
                      collapsedCssEditor ? "minimized" : ""
                    }`}
                    style={{
                      width: `${
                        collapsedHtmlEditor ? "100%" : rightEditorWidth
                      }`,
                    }}
                  >
                    <h2 className="panel-label">CSS</h2>
                    <CodeEditor
                      selectedLanguage="css"
                      code={state.css}
                      answers={exercise?.answers}
                      onChange={(newValue) => setState({ css: newValue })}
                      width="100%"
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          )}
        </div>
      ) : (
        <div className="text-center spinner">
          <div
            className="spinner-border"
            role="status"
            style={{ width: "60px", height: "60px", color: "#e9c46a" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {language !== "javascript" && language !== "python" && (
        <div className="preview-container">
          <PreviewPane html={state.previewHtml} css={state.previewCss} />
        </div>
      )}

      <FeedbackModal
        submittedAnswer={submittedAnswer}
        title={exercise?.name}
        setShowConfetti={setShowConfetti}
      />
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}
    </div>
  );
};
const Buttons = ({ text, handleSubmitValue, loading, remainingTime }) => {
  const { language, topic, exerciseNum } = useParams();
  const { exercises } = useContext(GlobalContext);

  const exercisesLength = exercises.filter(
    (exercise) =>
      exercise.topic.name === topic &&
      exercise.topic.language.name === language &&
      exercise.approved
  ).length;

  const handleNextClick = () => {
    if (exercisesLength <= Number(exerciseNum) + 1)
      alert(
        `You have mastered ${topic}, please select another topic to continue`
      );
  };
  return (
    <div className="d-flex my-4 gap-4 justify-content-center">
      <button className="btn" disabled={!Number(exerciseNum)}>
        <Link to={`/${language}/${topic}/${+exerciseNum - 1}`}>
          <i className="fa-solid fa-backward"></i>
        </Link>
      </button>
      <button
        onClick={handleSubmitValue}
        disabled={loading || remainingTime > 0}
        className="btn"
      >
        {loading ? "Loading..." : text}
        {remainingTime > 0 && <p>*{remainingTime} seconds until next run.</p>}
      </button>
      <button className="btn" onClick={handleNextClick}>
        <Link
          to={
            exercisesLength <= Number(exerciseNum) + 1
              ? `/${language}`
              : `/${language}/${topic}/${+exerciseNum + 1}`
          }
        >
          <i className="fa-solid fa-forward"></i>
        </Link>
      </button>
    </div>
  );
};

Buttons.propTypes = {
  text: PropTypes.string,
  handleSubmitValue: PropTypes.func,
  loading: PropTypes.bool,
  remainingTime: PropTypes.number,
};
export default ExerciseDetails;
