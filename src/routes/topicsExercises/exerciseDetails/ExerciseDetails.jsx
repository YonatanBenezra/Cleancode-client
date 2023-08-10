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
import DescriptionModal from "../../../components/modals/DescriptionModal";
import FeedbackModal from "../../../components/modals/FeedbackModal";

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

    return exercise;
  };
  const exercise = useExercise(exercises, topic, exerciseNum);
  // Custom hook
  const MIN_EDITOR_WIDTH = -90;

  const useResizer = (containerRef, resizerRef) => {
    const [isResizing, setIsResizing] = useState(false);
    const [leftEditorWidth, setLeftEditorWidth] = useState("50%");
    const [rightEditorWidth, setRightEditorWidth] = useState("50%");

    const handleMouseDown = () => setIsResizing(true);
    const handleMouseUp = useCallback(() => setIsResizing(false), []);

    const handleMouseMove = useCallback(
      (e) => {
        if (!isResizing) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const newWidthLeft = e.clientX - containerRect.left - 135;
        const newWidthRight = containerRect.right - e.clientX - 135;

        // This will prevent editors from becoming too narrow
        if (
          newWidthLeft < MIN_EDITOR_WIDTH ||
          newWidthRight < MIN_EDITOR_WIDTH
        ) {
          return;
        }

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

    return { handleMouseDown, leftEditorWidth, rightEditorWidth };
  };

  const { handleMouseDown, leftEditorWidth, rightEditorWidth } = useResizer(
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
      content += `\nQuestion: ${state.js}.\nHTML: ${state.html}\nCSS: ${state.css}\n`;
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

      const modal = new window.bootstrap.Modal(
        document.getElementById("feedbackModal"),
        {}
      );
      modal.show();
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
      {exercise ? (
        <div className="editors-container" ref={containerRef}>
          {language === "javascript" ? (
            <div className="editor js-editor">
              <h2 className="panel-label">{exercise?.description}</h2>
              <button
                className="btn mb-4"
                data-bs-toggle="modal"
                data-bs-target="#descriptionModal"
              >
                Read Description
              </button>
              <CodeEditor
                code={state.js}
                answers={exercise?.answers}
                selectedLanguage="javascript"
                onChange={(newValue) => setState({ js: newValue })}
              />
              <div className="d-flex my-4 gap-4">
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
                  {loading ? "Loading..." : "Run Code"}
                  {remainingTime > 0 && (
                    <p>*{remainingTime} seconds remaining for next run</p>
                  )}
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
            </div>
          ) : (
            <React.Fragment>
              <h2 className="panel-label">{exercise?.description}</h2>
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
                  {loading ? "Loading..." : "Show feedback"}
                  {remainingTime > 0 && (
                    <p>*{remainingTime} seconds remaining for next run</p>
                  )}
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
              <div className="html-css-editors-container">
                <div
                  className="editor html-css-editor"
                  style={{ width: `${leftEditorWidth}` }}
                >
                  <h2 className="panel-label">HTML</h2>

                  <CodeEditor
                    selectedLanguage="html"
                    code={state.html}
                    answers={exercise?.answers}
                    onChange={(newValue) => setState({ html: newValue })}
                  />
                </div>
                <div
                  className="resizer"
                  ref={resizerRef}
                  onMouseDown={handleMouseDown}
                ></div>
                <div
                  className="editor html-css-editor"
                  style={{ width: `${rightEditorWidth}` }}
                >
                  <h2 className="panel-label">CSS</h2>
                  <CodeEditor
                    selectedLanguage="css"
                    code={state.css}
                    answers={exercise?.answers}
                    onChange={(newValue) => setState({ css: newValue })}
                  />
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
      {language !== "javascript" && (
        <div className="preview-container">
          <PreviewPane html={state.previewHtml} css={state.previewCss} />
        </div>
      )}
      <DescriptionModal
        title={exercise?.description}
        description={exercise?.code}
      />
      <FeedbackModal submittedAnswer={submittedAnswer} />
    </div>
  );
};

export default ExerciseDetails;
