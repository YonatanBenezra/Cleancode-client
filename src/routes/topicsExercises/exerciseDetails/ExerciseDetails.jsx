import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useReducer,
} from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";

import GlobalContext from "../../../contexts/Global-Context";
import CodeEditor from "../../../components/codeEditor/CodeEditor";
import PreviewPane from "../../../components/previewPane/PreviewPane";
import "./exercise-details.scss";

const useModal = () => {
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return { modalIsOpen, openModal, closeModal };
};

const ExerciseDetails = () => {
  const { language, topic, exerciseNum } = useParams();
  const { exercises, setUser, user } = useContext(GlobalContext);
  const [remainingTime, setRemainingTime] = useState(0);

  const {
    modalIsOpen: modalIsOpen1,
    openModal: openModal1,
    closeModal: closeModal1,
  } = useModal();
  const {
    modalIsOpen: modalIsOpen2,
    openModal: openModal2,
    closeModal: closeModal2,
  } = useModal();

  const [showImage, setShowImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedAnswer, setSubmittedAnswer] = useState({});
  const containerRef = useRef(null);
  const resizerRef = useRef(null);

  const [state, setState] = useReducer(
    (prevState, newState) => ({ ...prevState, ...newState }),
    { html: "", css: "", js: "", previewHtml: "", previewCss: "" }
  );

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "30%",
    },
  };
  // Custom hook
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
  const { exercise, parsedCode } = useExercise(exercises, topic, exerciseNum);
  // Custom hook
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
  const { handleMouseDown, topEditorHeight, bottomEditorHeight } = useResizer(
    containerRef,
    resizerRef
  );
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
    setRemainingTime(30);
    const countdown = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
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

    if (language === "javascript") {
      content += `\nQuestion: ${parseInput(state.js).question}.\nJS: ${
        parseInput(state.js).code
      }.`;
    } else {
      content += `\nQuestion: ${parsedCode}.\nHTML: ${state.html}\nCSS: ${state.css}\n`;
    }

    if (
      !(
        parseInput(state.js)?.code?.trim() ||
        state.html.trim() ||
        state.css.trim()
      )
    ) {
      return setSubmittedAnswer({ isCorrect: false, score: 0 });
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

      setSubmittedAnswer(result);
      if (!(language === "javascript")) openModal2();
    } catch (error) {
      alert("Please try after 30 seconds");
    } finally {
      setLoading(false);
    }
  };
  const exercisesLength = exercises.filter(
    (exercise) =>
      exercise.topic.language.name === language && exercise.topic.name === topic
  ).length;

  const handleNextClick = () => {
    if (exercisesLength <= Number(exerciseNum) + 1)
      alert(
        `You have mastered ${topic}, please select another topic to continue`
      );
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
              height={window.innerWidth > 768 ? "50vh" : "70vh"}
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
                disabled={loading || remainingTime > 0}
                className="btn"
                style={{ marginTop: "15px" }}
              >
                {loading ? "Loading..." : "Run"}
              </button>
              {remainingTime > 0 && (
                <p>*{remainingTime} seconds remaining for next run</p>
              )}
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
              <p>
                {parsedCode?.slice(0, 60)}...
                <button className="btn see-more" onClick={openModal1}>
                  See More
                </button>
              </p>
              <button
                onClick={() => setShowImage((prev) => !prev)}
                className="btn next-link"
              >
                {showImage ? "Show Code" : "Show Image"}
              </button>

              <button
                onClick={handleSubmitValue}
                disabled={loading || remainingTime > 0}
                className="btn"
                style={{ marginLeft: "20px" }}
              >
                {loading ? "Loading..." : "Run"}
              </button>
              {!!Number(exerciseNum) && (
                <Link
                  className="btn"
                  style={{ marginLeft: "20px" }}
                  to={`/${language}/${topic}/${+exerciseNum - 1}`}
                >
                  Prev
                </Link>
              )}
              {
                <Link
                  className="btn"
                  style={{ marginLeft: "20px" }}
                  to={
                    exercisesLength <= Number(exerciseNum) + 1
                      ? `/${language}`
                      : `/${language}/${topic}/${+exerciseNum + 1}`
                  }
                  onClick={handleNextClick}
                >
                  Next
                </Link>
              }
              {remainingTime > 0 && (
                <p>*{remainingTime} seconds remaining for next run</p>
              )}
            </div>
            {showImage ? (
              <div className="app-container" style={{ textAlign: "center" }}>
                <img
                  src={exercise.imageUrl}
                  alt="code"
                  style={{ margin: "20px", width: "80%", borderRadius: "5px" }}
                />
              </div>
            ) : (
              <React.Fragment>
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
              </React.Fragment>
            )}
          </div>
          <div className="preview-container">
            <PreviewPane html={state.previewHtml} css={state.previewCss} />
          </div>
        </div>
      )}

      {/* Render Modal for JavaScript */}
      <Modal
        isOpen={modalIsOpen1}
        onRequestClose={closeModal1}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <button onClick={closeModal1}>close</button>
        <h4 className="modal-content">{parsedCode}</h4>
      </Modal>

      {/* Render Modal for HTML/CSS */}
      <Modal
        isOpen={modalIsOpen2}
        onRequestClose={closeModal2}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <button onClick={closeModal2}>close</button>
        <div className="modal-content">
          <p>
            Your answer was{" "}
            <code>{submittedAnswer.isCorrect ? "Correct" : "Wrong"}</code>. Its
            score is: {submittedAnswer.score}
          </p>
          {submittedAnswer.hints && <p>Hints: {submittedAnswer.hints}</p>}
          {submittedAnswer.badPractices && (
            <p>Bad Practices: {submittedAnswer.badPractices}</p>
          )}
          {submittedAnswer.bestPractices && (
            <p>Best Practices: {submittedAnswer.bestPractices}</p>
          )}
          {submittedAnswer.tips && <p>Tips: {submittedAnswer.tips}</p>}
        </div>
      </Modal>
    </div>
  );
};

export default ExerciseDetails;
